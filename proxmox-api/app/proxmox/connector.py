from proxmoxer import ProxmoxAPI
import os
from dotenv import load_dotenv

class ProxConn:
    def __init__(self):
        load_dotenv()
        API_USER = os.getenv("PROXMOX_API_USER")
        API_KEY = os.getenv("PROXMOX_API_KEY")
        PROXMOX_IP = os.getenv("PROXMOX_IP")
        self.connection = ProxmoxAPI(
            PROXMOX_IP, user = API_USER, token_name = "API", token_value = API_KEY, verify_ssl = False
        )

    def __getattr__(self, name): # This is for using all the methods available on ProxmoxAPI.
        if self.connection:
            return getattr(self.connection, name)
        raise AttributeError(f"'{self.__class__.__name__}' object has no attribute '{name}'")
