#!/bin/bash

# Variables
IMAGE_URL="https://repo.almalinux.org/almalinux/9/cloud/x86_64/images/AlmaLinux-9-GenericCloud-latest.x86_64.qcow2"
NODE_MAX_CORES=16 # Define the max number of cores of the hypervisor (to add CPU hotplug support)
VM_CORES="1"
IMAGE_NAME="almalinux-cloud.qcow2"
STORAGE_POOL="local-lvm"
VM_ID="9001"
VM_NAME="alma-cloud-template"
BRIDGE="INTERNA1"  # Change to your network bridge

# Download the latest AlmaLinux Cloud image
echo "Downloading latest AlmaLinux Cloud Image..."
wget -O "$IMAGE_NAME" "$IMAGE_URL"

# Create a new VM in Proxmox
echo "Creating VM $VM_ID..."
qm create "$VM_ID" --name "$VM_NAME" --cpu host --cores "$NODE_MAX_CORES" --machine q35 --numa 1 --vcpus "$VM_CORES" --memory 2048 --net0 virtio,bridge="$BRIDGE"
qm set "$VM_ID" --scsihw virtio-scsi-pci --scsi0 "$STORAGE_POOL:0,import-from=$PWD/$IMAGE_NAME"
qm set "$VM_ID" --boot order=scsi0
qm set "$VM_ID" --ide2 "$STORAGE_POOL:cloudinit"
#qm set "$VM_ID" --cicustom "vendor=local:snippets/vendor-ubuntu.yml"
qm set "$VM_ID" --ciuser "mtm" # Testing
qm set "$VM_ID" --cipassword "pepe" # Testing
qm set "$VM_ID" --ipconfig0 ip=dhcp
qm set "$VM_ID" --agent 1
qm template "$VM_ID"

echo "AlmaLinux Cloud Image template creation completed."
