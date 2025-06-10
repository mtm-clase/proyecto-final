import { useState, useEffect } from "react"
import { Server, Power, RefreshCw, Eye, EyeOff } from "lucide-react"
import { api } from "@/services/api"
import { ClientSearch } from "./client-search"
import { ServerStats } from "./server-stats"

interface VPS {
  id: string
  name: string
  status: "running" | "stopped" | "restarting"
  ip: string
  plan: string
  cpu: number
  ram: number
  storage: number
  location: string
  uptime: string
  cpuUsage: number
  ramUsage: number
  storageUsage: number
  networkIn: number
  networkOut: number
  client_id?: string
  client?: string
  username: string
  password: string
}

interface VpsManagerProps {
  userRole: string | null
  userId: string | null
}

const formatUptime = (seconds: number) => {
  const days = Math.floor(seconds / (24 * 60 * 60))
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))
  const minutes = Math.floor((seconds % (60 * 60)) / 60)

  if (days > 0) {
    return `${days}d ${hours}h`
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

export function VpsManager({ userRole, userId }: VpsManagerProps) {
  const [vpsServers, setVpsServers] = useState<VPS[]>([])
  const [selectedVps, setSelectedVps] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [assignClientModal, setAssignClientModal] = useState<{ open: boolean, vmId: string | null }>({ open: false, vmId: null })
  const [showPassword, setShowPassword] = useState<boolean>(false)

  useEffect(() => {
    const fetchVpsData = async () => {
      try {
        setLoading(true)
        const data = await api.get("/vps")
        // Verificar si el servidor seleccionado existe en los nuevos datos
        if (selectedVps && !data.find((server: VPS) => server.id === selectedVps)) {
          setSelectedVps(data[0]?.id || null)
        }
        setVpsServers(data)
      } catch (error) {
        console.error("Error fetching VPS:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchVpsData()
    const interval = setInterval(fetchVpsData, 15000)
    return () => clearInterval(interval)
  }, [selectedVps])

  const handleVpsAction = async (vpsId: string, action: "start" | "stop" | "restart") => {
    try {
      await api.post(`/vps/${vpsId}/${action}`, {})
      setVpsServers((prevServers) =>
        prevServers.map((server) =>
          server.id === vpsId
            ? {
                ...server,
                status: action === "start" ? "running" : action === "stop" ? "stopped" : "restarting",
              }
            : server
        )
      )
    } catch (error) {
      console.error(`Error ${action}ing VPS:`, error)
    }
  }

  const handleAssignClient = async (clientId: string, clientName: string) => {
    if (!assignClientModal.vmId) return
    try {
      await api.post(`/vps/${assignClientModal.vmId}/assign-client`, { clientId })
      setVpsServers((prev) =>
        prev.map((vps) =>
          vps.id === assignClientModal.vmId ? { ...vps, client: clientName } : vps
        )
      )
      setAssignClientModal({ open: false, vmId: null })
    } catch (error) {
      alert("No se pudo asignar el cliente")
    }
  }

  const selectedServer = vpsServers.find((server) => server.id === selectedVps)

  return (
    <>
      {userRole === "admin" && (
        <div className="mb-4 p-4 bg-amber-900/30 border border-amber-700 rounded-lg text-amber-200">
          <b>Vista Superadmin:</b> Puedes ver y reasignar todas las VPS a cualquier cliente.
        </div>
      )}

      {loading && vpsServers.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">
                  {userRole === "admin" ? "Todas las VPS" : "Mis Servidores"}
                </h2>
              </div>
              <div className="p-2">
                {vpsServers.length === 0 ? (
                  <p className="text-gray-400 p-4 text-center">No hay servidores VPS</p>
                ) : (
                  <ul className="space-y-2">
                    {vpsServers
                      .filter((server) => userRole === "admin" || server.client_id === userId)
                      .map((server) => (
                        <li key={server.id}>
                          <button
                            onClick={() => setSelectedVps(server.id)}
                            className={`w-full text-left p-3 rounded-lg transition-colors flex items-center ${
                              selectedVps === server.id
                                ? "bg-gray-700 text-white"
                                : "hover:bg-gray-700/50 text-gray-300"
                            }`}
                          >
                            <Server className="h-5 w-5 mr-3" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{server.name}</p>
                              <div className="flex items-center mt-1">
                                <span
                                  className={`h-2 w-2 rounded-full mr-2 ${
                                    server.status === "running"
                                      ? "bg-green-500"
                                      : server.status === "stopped"
                                      ? "bg-red-500"
                                      : "bg-yellow-500"
                                  }`}
                                />
                                <span className="text-xs text-gray-400">
                                  {server.status === "running"
                                    ? "Ejecutándose"
                                    : server.status === "stopped"
                                    ? "Detenido"
                                    : "Reiniciando"}
                                </span>
                              </div>
                            </div>
                          </button>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {selectedServer ? (
              <div className="space-y-6">
                <div className="bg-gray-800 rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold text-white">{selectedServer.name}</h2>
                      <div className="mt-1 space-y-1">
                        <p className="text-sm text-gray-400">
                          IP: <span className="text-cyan-400">{selectedServer.ip || "No disponible"}</span>
                        </p>
                        {selectedServer.status === "running" && (
                          <p className="text-sm text-gray-400">
                            Uptime: <span className="text-cyan-400">{formatUptime(parseInt(selectedServer.uptime))}</span>
                          </p>
                        )}
                        <div className="flex items-center space-x-2">
                          <p className="text-sm text-gray-400">
                            Credenciales: <span className="text-cyan-400">{selectedServer.username}</span>
                            {showPassword ? (
                              <>
                                <span className="text-cyan-400 ml-2">{selectedServer.password}</span>
                                <button
                                  onClick={() => setShowPassword(false)}
                                  className="p-1 hover:bg-gray-700/50 rounded inline-flex items-center ml-2"
                                  title="Ocultar contraseña"
                                >
                                  <EyeOff className="h-4 w-4 text-gray-400" />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => setShowPassword(true)}
                                className="p-1 hover:bg-gray-700/50 rounded inline-flex items-center ml-2"
                                title="Mostrar contraseña"
                              >
                                <Eye className="h-4 w-4 text-gray-400" />
                              </button>
                            )}
                          </p>
                        </div>
                        {userRole === "admin" && (
                          <p className="text-sm text-cyan-400">
                            Cliente: {selectedServer.client || "Sin asignar"}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {userRole === "admin" && (
                        <button
                          onClick={() => setAssignClientModal({ open: true, vmId: selectedServer.id })}
                          className="px-3 py-1 rounded bg-cyan-600 text-white text-sm hover:bg-cyan-700"
                        >
                          Asignar Cliente
                        </button>
                      )}
                      <button
                        onClick={() => handleVpsAction(selectedServer.id, "restart")}
                        className="p-2 rounded hover:bg-amber-600/20 text-amber-400"
                        title="Reiniciar"
                      >
                        <RefreshCw className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleVpsAction(selectedServer.id, selectedServer.status === "running" ? "stop" : "start")}
                        className={`p-2 rounded ${
                          selectedServer.status === "running" 
                            ? "hover:bg-red-600/20 text-red-400" 
                            : "hover:bg-green-600/20 text-green-400"
                        }`}
                        title={selectedServer.status === "running" ? "Detener" : "Iniciar"}
                      >
                        <Power className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <ServerStats server={selectedServer} />
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-xl p-8 text-center text-gray-400">
                <Server className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Selecciona un servidor para ver sus detalles</p>
              </div>
            )}
          </div>
        </div>
      )}

      {userRole === "admin" && assignClientModal.open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4 text-white">Asignar cliente a VPS</h2>
            <ClientSearch onSelect={handleAssignClient} />
            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="px-3 py-1 rounded bg-gray-700 text-white"
                onClick={() => setAssignClientModal({ open: false, vmId: null })}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}