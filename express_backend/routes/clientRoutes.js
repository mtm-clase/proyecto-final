import express from "express"
import { getAllClients, updateClientCredits, getClientCredits, getProfile, updateProfile } from "../controllers/clientController.js"
import { authenticateToken, isAdmin } from "../middleware/auth.js"

const router = express.Router()

router.get("/", authenticateToken, isAdmin, getAllClients)
router.get("/profile", authenticateToken, getProfile)
router.put("/profile", authenticateToken, updateProfile)
router.get("/credits", authenticateToken, async (req, res) => {
    try {
    const credits = await getClientCredits(req.user.id)
    res.json({ credits })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
router.post("/credits/:clientId", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { amount } = req.body
    const result = await updateClientCredits(req.params.clientId, parseInt(amount))
    res.json(result)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

export default router