import express from "express"
import { getAllVps, getVpsById, startVps, stopVps, restartVps, createVps, getVpsStatus, getVpsIp, assignClient } from "../controllers/vpsController.js"
import { isAdmin } from '../middleware/auth.js'

const router = express.Router()

// Rutas públicas
router.post("/create", createVps)
router.get("/:id", getVpsById)
router.get("/:id/status", getVpsStatus)
router.get("/:id/ip", getVpsIp)
router.post("/:id/start", startVps)
router.post("/:id/stop", stopVps)
router.post("/:id/restart", restartVps)
router.get("/", getAllVps)
router.post('/:vpsId/assign-client', isAdmin, assignClient)

export default router