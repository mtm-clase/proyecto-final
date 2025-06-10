import bcrypt from 'bcrypt'
import { pool } from "../config/db.js"

export const createClient = async ({ name, email, password, company, phone }) => {
  try {
    const [existingClient] = await pool.query(
      "SELECT id FROM clients WHERE email = ?",
      [email]
    )

    if (existingClient.length > 0) {
      return { error: "El correo electrónico ya está registrado", clientId: existingClient[0].id }
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const [result] = await pool.query(
      "INSERT INTO clients (name, email, password, company, phone) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, company, phone]
    )

    return { success: true, clientId: result.insertId }
  } catch (error) {
    console.error("Error creating client:", error)
    throw error
  }
}

export const getAllClients = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, company, phone, credits, created_at FROM clients WHERE role_id != (SELECT id FROM roles WHERE role_name = 'admin')"
    )
    console.log("Clients retrieved:", rows)
    res.json(rows)
  } catch (error) {
    console.error("Error getting client:", error)
    throw error
  }
}

export const getClientByEmail = async (email) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, company, phone, credits, role_id, created_at FROM clients WHERE email = ?",
      [email]
    )
    return rows[0]
  } catch (error) {
    console.error("Error getting client:", error)
    throw error
  }
}

export const verifyPassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword)
}

export const updateClientCredits = async (clientId, amount) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Verificar saldo actual
    const [currentBalance] = await connection.query(
      "SELECT credits FROM clients WHERE id = ?",
      [clientId]
    );

    if (currentBalance.length === 0) {
      throw new Error("Cliente no encontrado");
    }

    const newBalance = currentBalance[0].credits + amount;
    
    if (newBalance < 0) {
      throw new Error("Saldo insuficiente");
    }

    // Actualizar saldo
    await connection.query(
      "UPDATE clients SET credits = ? WHERE id = ?",
      [newBalance, clientId]
    );

    await connection.commit();
    return { success: true, newBalance };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const getClientCredits = async (clientId) => {
  try {
    const [rows] = await pool.query(
      "SELECT credits FROM clients WHERE id = ?",
      [clientId]
    );
    return rows[0]?.credits || 0;
  } catch (error) {
    console.error("Error getting client credits:", error);
    throw error;
  }
};

export const getProfile = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, company, phone, credits, created_at FROM clients WHERE id = ?",
      [req.user.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error getting profile:", error);
    res.status(500).json({ error: "Error obteniendo perfil" });
  }
};

export const updateProfile = async (req, res) => {
  const { name, company, phone } = req.body;
  
  try {
    await pool.query(
      "UPDATE clients SET name = ?, company = ?, phone = ? WHERE id = ?",
      [name, company, phone, req.user.id]
    );

    const [updated] = await pool.query(
      "SELECT id, name, email, company, phone, credits, created_at FROM clients WHERE id = ?",
      [req.user.id]
    );

    res.json(updated[0]);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Error actualizando perfil" });
  }
};