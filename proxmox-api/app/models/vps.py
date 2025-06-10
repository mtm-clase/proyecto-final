from pydantic import BaseModel

class RequestClient(BaseModel):
    client_id: str

class NewVM(BaseModel):
    pool_name: str
    vm_name: str
    cpu: int
    ram: int
    disk: str
    distro: str
    password: str