import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const authenticateToken = (req, res, next) => {
  const JWT_SECRET = process.env.JWT_SECRET

  if (!JWT_SECRET) {
    console.error('JWT_SECRET no está definido en las variables de entorno')
    return res.status(500).json({ error: 'Error de configuración del servidor' })
  }

  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    console.error('Error verificando token:', error)
    return res.status(403).json({ error: 'Token inválido' })
  }
}

export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Usuario no autenticado' })
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Se requieren permisos de administrador' })
  }

  next()
}