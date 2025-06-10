import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { api } from "@/services/api"

interface Client {
  id: string
  name: string
  email: string
}

interface ClientSearchProps {
  onSelect: (clientId: string, clientName: string) => void
}

export function ClientSearch({ onSelect }: ClientSearchProps) {
  const [search, setSearch] = useState("")
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true)
        const data = await api.get("/clients")
        setClients(data)
      } catch (error) {
        console.error("Error cargando clientes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(search.toLowerCase()) ||
    client.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="w-full">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 p-2 rounded bg-gray-800 text-white"
        />
      </div>
      <div className="mt-2 max-h-48 overflow-y-auto">
        {loading ? (
          <p className="text-gray-400 text-center py-2">Cargando...</p>
        ) : filteredClients.length === 0 ? (
          <p className="text-gray-400 text-center py-2">No se encontraron clientes</p>
        ) : (
          <ul className="space-y-1">
            {filteredClients.map(client => (
              <li key={client.id}>
                <button
                  onClick={() => onSelect(client.id, client.name)}
                  className="w-full text-left p-2 hover:bg-gray-700 rounded text-sm"
                >
                  <p className="font-medium text-white">{client.name}</p>
                  <p className="text-gray-400 text-xs">{client.email}</p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}