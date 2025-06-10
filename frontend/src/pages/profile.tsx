"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { api } from "@/services/api"
import { AlertCircle } from "lucide-react"

interface Client {
  id: string
  name: string
  email: string
  company: string | null
  phone: string | null
  credits: number
  created_at: string
}

export default function ProfilePage() {
  const location = useLocation()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUserRole(payload.role)
      } catch (e) {
        console.error("Error decodificando token:", e)
      }
    }
  }, [])

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await api.get("/clients")
        setClients(data)
      } catch (error: any) {
        setError(error.message || "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    if (userRole === "admin") {
      fetchClients()
    }
  }, [userRole])

  const handleUpdateCredits = async (clientId: string, amount: number) => {
    try {
      await api.post(`/clients/credits/${clientId}`, { amount })
      setClients(clients.map(client => 
        client.id === clientId 
          ? { ...client, credits: client.credits + amount }
          : client
      ))
    } catch (error: any) {
      alert("Error al actualizar créditos")
    }
  }

  return (
    <div className="bg-[#030712] min-h-screen text-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Panel de Control</h1>
          <div className="flex space-x-4">
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-lg transition-colors ${
                location.pathname === "/dashboard"
                  ? "bg-cyan-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              VPS
            </Link>
            <Link
              to="/dashboard/profile"
              className={`px-4 py-2 rounded-lg transition-colors ${
                location.pathname === "/dashboard/profile"
                  ? "bg-cyan-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Perfiles
            </Link>
          </div>
        </div>

        {userRole === "admin" && (
          <div className="mb-4 p-4 bg-amber-900/30 border border-amber-700 rounded-lg text-amber-200">
            <b>Vista Superadmin:</b> Gestiona los créditos de todos los clientes.
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900/30 border border-red-700 text-red-100 px-4 py-3 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
            <div>
              <p className="font-medium">Error al cargar los datos</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Empresa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Teléfono</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Créditos</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{client.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{client.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{client.company || "-"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{client.phone || "-"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-cyan-400">{client.credits}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleUpdateCredits(client.id, 500)}
                        className="text-cyan-400 hover:text-cyan-300 mr-3"
                      >
                        +500
                      </button>
                      <button
                        onClick={() => handleUpdateCredits(client.id, -500)}
                        className="text-red-400 hover:text-red-300"
                      >
                        -500
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}