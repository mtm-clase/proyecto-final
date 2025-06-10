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

def get_node_for_vmid(prox, vmid):
    """
    Obtiene el nodo donde se encuentra un VPS específico.

    Args:
        prox: Conexión Proxmox.
        vmid (int): ID de la máquina virtual.

    Returns:
        str: Nombre del nodo donde se encuentra el VPS.

    Raises:
        Exception: Si no se encuentra el VPS.
    """
    vms = prox.cluster.resources.get(type="vm")
    vm_info = next((vm for vm in vms if vm["vmid"] == vmid), None)
    if not vm_info:
        raise Exception("VPS no encontrado")
    return vm_info["node"]

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