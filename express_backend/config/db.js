import { createPool } from "mysql2/promise"
import dotenv from "dotenv"
dotenv.config()

export const pool = createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "vps_management",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})