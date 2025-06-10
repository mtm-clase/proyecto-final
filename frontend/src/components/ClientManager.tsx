import { useState, useEffect } from "react"
import { api } from "@/services/api"

interface Client {
  id: string
  name: string
  email: string
  company: string | null
  phone: string | null
  credits: number
  created_at: string
}

interface ClientManagerProps {
  userRole: string | null
}

export function ClientManager({ userRole }: ClientManagerProps) {
  const [clients, setClients] = useState<Client[]>([])

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await api.get("/clients")
        setClients(data)
      } catch (error) {
        console.error("Error loading clients:", error)
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
    } catch (error) {
      alert("Error al actualizar créditos")
    }
  }

  return (
    <>
      {userRole === "admin" && (
        <div className="mb-4 p-4 bg-amber-900/30 border border-amber-700 rounded-lg text-amber-200">
          <b>Vista Superadmin:</b> Gestiona los créditos de todos los clientes.
        </div>
      )}

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
    </>
  )
}