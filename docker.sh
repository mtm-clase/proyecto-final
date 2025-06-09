podman compose down
podman image rm repo-frontend
podman image rm repo-backend
podman image rm repo-proxmox_backend
podman compose -f docker-compose.yml up -d
