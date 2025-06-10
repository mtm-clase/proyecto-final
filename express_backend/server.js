import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { authenticateToken } from "./middleware/auth.js"
import vpsRoutes from "./routes/vpsRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import clientRoutes from "./routes/clientRoutes.js"
import planRoutes from "./routes/planRoutes.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))
app.use(express.json())

// Rutas públicas
app.use("/api/auth", authRoutes)
app.use("/api/plans", planRoutes)

// Rutas protegidas
app.use("/api/vps", authenticateToken, vpsRoutes)
app.use("/api/clients", authenticateToken, clientRoutes)

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('¡Algo salió mal!')
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor Express ejecutándose en http://localhost:${PORT}`)
})

