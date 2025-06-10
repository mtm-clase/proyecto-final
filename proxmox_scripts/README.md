# Proxmox scripts
## Description
This repo hosts all the scripts the hypervisor will use.

`images/` hosts scripts to download templates and preconfigure them (install basic packages like `qemu-guest-agent`, that is not included by default on Ubuntu images, no clue to why, add SSH keys, etc) using cloud-init, as it's the easiest way.

