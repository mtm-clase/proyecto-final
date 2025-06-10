import os

UBUNTU_TEMPLATE_VMID = int(os.getenv("UBUNTU_TEMPLATE_VMID", "9000"))
ALMA_TEMPLATE_VMID = int(os.getenv("ALMA_TEMPLATE_VMID", "9001"))

def get_last_vm(prox):
    """
    Obtiene el ID más alto de las máquinas virtuales existentes.

    Args:
        prox: Conexión Proxmox.

    Returns:
        int: El VMID más alto.
    """
    vmids = [vm["vmid"] for vm in prox.cluster.resources.get(type = "vm")]
    return max(vmids)

def set_resources(prox, resources):
    """
    Ajusta los recursos (CPU, RAM, disco) de una máquina virtual.

    Args:
        prox: Conexión Proxmox.
        resources (dict): Diccionario con las claves 'node', 'vmid', 'cpu', 'ram', 'disk'.
    """
    node = resources["node"]
    vmid = resources["vmid"]
    cpu = resources["cpu"]
    ram = resources["ram"]
    disk_size = resources["disk"]
    prox.nodes(node).qemu(vmid).config.post(vcpus = cpu, memory = ram)
    prox.nodes(node).qemu(vmid).resize.put(disk = "scsi0", size = disk_size)
