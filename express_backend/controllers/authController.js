import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { pool } from '../config/db.js'
import { createClient, getClientByEmail, verifyPassword } from "./clientController.js"

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no está definido en las variables de entorno')
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const [rows] = await pool.query(
      "SELECT clients.id, email, password, role_name as role FROM clients JOIN roles ON clients.role_id = roles.id WHERE email = ?",
      [email]
    )

    if (rows.length === 0) {
      return res.status(401).json({ error: "Credenciales inválidas" })
    }

    const client = rows[0]
    const isValidPassword = await verifyPassword(password, client.password)

    if (!isValidPassword) {
      return res.status(401).json({ error: "Credenciales inválidas" })
    }

    // Si es admin@admin.com, asignamos role admin
    const role = client.role === "admin" ? "admin" : "user"

    const token = jwt.sign(
      { 
        id: client.id, 
        email: client.email,
        role: role
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    )

    res.json({
      token,
      user: {
        id: client.id,
        email: client.email,
        role: role
      }
    })
  } catch (error) {
    console.error("Error en login:", error)
    res.status(500).json({ error: "Error en el servidor" })
  }
}

export const register = async (req, res) => {
  try {
    const { name, email, password, company, phone } = req.body

    // TODO: Descomentar para producción
    // if (email === 'admin@admin.com') {
    //   return res.status(400).json({ error: "Este email no está permitido" })
    // }

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Faltan campos obligatorios" })
    }

    const result = await createClient({ name, email, password, company, phone })

    if (result.error) {
      return res.status(400).json({ error: result.error })
    }

    const token = jwt.sign(
      { id: result.clientId, email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    )

    res.json({
      success: true,
      token,
      user: {
        id: result.clientId,
        email,
        name
      }
    })
  } catch (error) {
    console.error("Error en registro:", error)
    res.status(500).json({ error: "Error al registrar usuario" })
  }
}