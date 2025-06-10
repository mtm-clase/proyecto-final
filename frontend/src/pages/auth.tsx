"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Layout } from "@/components/ui/Layout"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"

export default function AuthPage() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
    phone: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const endpoint = isLogin ? "login" : "register"
      const response = await axios.post(`/api/auth/${endpoint}`, formData)
      localStorage.setItem("token", response.data.token)
      navigate("/dashboard")
    } catch (err: any) {
      setError(err.response?.data?.error || `Error al ${isLogin ? 'iniciar sesión' : 'registrarse'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <Card>
            <Card.Header>
              <Card.Title>{isLogin ? "Iniciar Sesión" : "Crear Cuenta"}</Card.Title>
              <button
                type="button"
                className="text-sm text-cyan-500 hover:underline mt-2"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
              </button>
            </Card.Header>

            {error && (
              <div className="bg-red-900/30 border border-red-700 text-red-100 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {!isLogin && (
                <Input
                  label="Nombre completo"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              )}

              <Input
                label="Correo electrónico"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />

              <Input
                label="Contraseña"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />

              {!isLogin && (
                <>
                  <Input
                    label="Empresa (opcional)"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                  <Input
                    label="Teléfono (opcional)"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </>
              )}
            </div>

            <Button
              type="submit"
              className="w-full mt-6"
              isLoading={loading}
              colorScheme="cyan"
            >
              {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
            </Button>
          </Card>
        </form>
      </div>
    </Layout>
  )
}