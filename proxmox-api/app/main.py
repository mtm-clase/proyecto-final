from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.vps import router as vps_router
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(vps_router)

@app.get("/")
def index():
    return {"message": "Proxmox API running"}