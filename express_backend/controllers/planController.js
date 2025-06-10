import { pool } from "../config/db.js"

export const getAllPlans = async (req, res) => {
  try {
    const [plans] = await pool.query(
      "SELECT id, name, price, cpu, ram, storage, bandwidth FROM plans"
    )
    res.json(plans)
  } catch (error) {
    console.error("Error getting plans:", error)
    res.status(500).json({ error: "Error obteniendo los planes" })
  }
}

export const getPlanById = async (req, res) => {
  try {
    const [plan] = await pool.query(
      "SELECT id, name, price, cpu, ram, storage, bandwidth FROM plans WHERE id = ?",
      [req.params.id]
    )
    if (plan.length === 0) {
      return res.status(404).json({ error: "Plan no encontrado" })
    }
    res.json(plan[0])
  } catch (error) {
    console.error("Error getting plan:", error)
    res.status(500).json({ error: "Error obteniendo el plan" })
  }
}