from fastapi import APIRouter, HTTPException
from app.models.vps import RequestClient, NewVM
from app.services.vps import get_last_vm, set_resources, get_node_for_vmid
from app.proxmox import connector
import os
import secrets
import string

router = APIRouter(prefix="/api/vps", tags=["vps"])

UBUNTU_TEMPLATE_VMID = int(os.getenv("UBUNTU_TEMPLATE_VMID", "9000"))
ALMA_TEMPLATE_VMID = int(os.getenv("ALMA_TEMPLATE_VMID", "9001"))

@router.get("/")
def get_vms():
    prox = connector.ProxConn()
    node = prox.nodes.get()[0]["node"]
    vms = [virtual_machine for virtual_machine in prox.nodes(node).qemu.get()]
    return vms

async def configure_cloud_init(prox, node_name, vmid, username, password):
    try:
        ciconfig = {
            "ciuser": username,
            "cipassword": password,
            "searchdomain": "vps.local",
            "nameserver": "1.1.1.1",
            "sshkeys": ""
        }
        prox.nodes(node_name).qemu(vmid).config.put(**ciconfig)
        return True
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error configurando cloud-init: {str(e)}")

@router.post("/create")
async def create_vm(vm: NewVM):
    prox = connector.ProxConn()
    node_name = prox.nodes.get()[0]["node"]
    new_vmid = get_last_vm(prox) + 1
    username = "user"
    password = vm.password  # Usar la contraseña recibida desde Express

    try:
        # Verificar si el pool existe, si no, crearlo
        pools = [pool["poolid"] for pool in prox.pools.get()]
        if vm.pool_name not in pools:
            prox.pools.post(poolid=vm.pool_name)

        match vm.distro:
            case "ubuntu":
                proxmox_ticket = prox.nodes(node_name).qemu(UBUNTU_TEMPLATE_VMID).clone.post(
                    newid=new_vmid, 
                    node=node_name, 
                    name=vm.vm_name,
                    pool=vm.pool_name
                )
            case "almalinux":
                proxmox_ticket = prox.nodes(node_name).qemu(ALMA_TEMPLATE_VMID).clone.post(
                    newid=new_vmid, 
                    node=node_name, 
                    name=vm.vm_name,
                    pool=vm.pool_name
                )
            case _:
                return {"error": "Distro not specified. Use ubuntu or almalinux."} 

        # Configurar cloud-init después de clonar
        await configure_cloud_init(prox, node_name, new_vmid, username, password)

        resources = {
            "vmid": new_vmid,
            "node": node_name,
            "cpu": vm.cpu,
            "ram": vm.ram,
            "disk": vm.disk
        }
        set_resources(prox, resources)
        
        return {
            "success": True,
            "vmid": new_vmid,
            "credentials": {
                "username": username,
                "password": password
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/new-client")
async def new_user(user: RequestClient):
    prox = connector.ProxConn()
    pool_name = user.client_id
    prox.pools.post(poolid=pool_name)

@router.delete("/delete/{vm_id}")
async def delete_vm(vm_id: int):
    prox = connector.ProxConn()
    node_name = prox.nodes.get()[0]["node"]
    try:
        proxmox_ticket = prox.nodes(node_name).qemu(vm_id).delete()
    except Exception as e:
        return {"message": str(e)}
    return {
        "proxmox-ticket": proxmox_ticket
    }

@router.get("/{vmid}")
async def get_vps_by_id(id: int):
    prox = connector.ProxConn()
    try:
        vms = prox.cluster.resources.get(type="vm")
        vm_info = next((vm for vm in vms if vm["vmid"] == id), None)
        if not vm_info:
            return {"error": "VPS no encontrado"}

        node = vm_info["node"]
        details = prox.nodes(node).qemu(id).status.current.get()
        vm_data = {**vm_info, **details}
        return vm_data
    except Exception as e:
        return {"error": str(e)}

@router.get("/{vmid}/ip")
async def get_vps_ip(vmid: int):
    prox = connector.ProxConn()
    try:
        node = get_node_for_vmid(prox, vmid)
        response = prox.nodes(node).qemu(vmid).agent("network-get-interfaces").get()
        interfaces = response.get("result", [])

        for interface in interfaces:
            if "ip-addresses" in interface:
                for ip in interface["ip-addresses"]:
                    if ip.get("ip-address-type") == "ipv4":
                        ip_addr = ip.get("ip-address")
                        if ip_addr and not ip_addr.startswith("127."):
                            return {"ip": ip_addr}

        return {"ip": "No disponible"}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/{vmid}/status")
async def get_vps_status(vmid: int):
    prox = connector.ProxConn()
    try:
        node = get_node_for_vmid(prox, vmid)
        response = prox.nodes(node).qemu(vmid).status.current.get()
        return response
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/{vmid}/start")
async def start_vps(vmid: int):
    prox = connector.ProxConn()
    try:
        node = get_node_for_vmid(prox, vmid)
        response = prox.nodes(node).qemu(vmid).status.start.post()
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/{vmid}/stop")
async def stop_vps(vmid: int):
    prox = connector.ProxConn()
    try:
        node = get_node_for_vmid(prox, vmid)
        response = prox.nodes(node).qemu(vmid).status.stop.post()
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/{vmid}/restart")
async def restart_vps(vmid: int):
    prox = connector.ProxConn()
    try:
        node = get_node_for_vmid(prox, vmid)
        response = prox.nodes(node).qemu(vmid).status.reset.post()
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

