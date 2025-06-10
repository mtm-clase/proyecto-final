import { Activity, Cpu, HardDrive, Network } from "lucide-react"

interface ServerStatsProps {
  server: {
    status: string
    ip: string
    cpu: number
    ram: number
    storage: number
    cpuUsage: number
    ramUsage: number
    storageUsage: number
    networkIn: number
    networkOut: number
  }
}

export function ServerStats({ server }: ServerStatsProps) {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <div className="bg-gray-900 p-4 rounded-lg">
        <div className="flex items-center text-gray-400 mb-2">
          <Activity className="h-4 w-4 mr-2" />
          <span className="text-xs uppercase">CPU</span>
        </div>
        <div className="flex items-baseline">
          <span className="text-2xl font-semibold text-white">{server.cpuUsage}%</span>
          <span className="text-xs text-gray-400 ml-2">de {server.cpu} vCPUs</span>
        </div>
      </div>

      <div className="bg-gray-900 p-4 rounded-lg">
        <div className="flex items-center text-gray-400 mb-2">
          <Cpu className="h-4 w-4 mr-2" />
          <span className="text-xs uppercase">Memoria</span>
        </div>
        <div className="flex items-baseline">
          <span className="text-2xl font-semibold text-white">{server.ramUsage}%</span>
          <span className="text-xs text-gray-400 ml-2">de {server.ram}GB</span>
        </div>
      </div>

      <div className="bg-gray-900 p-4 rounded-lg">
        <div className="flex items-center text-gray-400 mb-2">
          <HardDrive className="h-4 w-4 mr-2" />
          <span className="text-xs uppercase">Almacenamiento</span>
        </div>
        <div className="flex items-baseline">
          <span className="text-2xl font-semibold text-white">
            {server.storage}GB
          </span>
        </div>
      </div>

      <div className="bg-gray-900 p-4 rounded-lg">
        <div className="flex items-center text-gray-400 mb-2">
          <Network className="h-4 w-4 mr-2" />
          <span className="text-xs uppercase">Red</span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">↓</span>
            <span className="text-sm text-white">{formatBytes(server.networkIn)}/s</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-400">↑</span>
            <span className="text-sm text-white">{formatBytes(server.networkOut)}/s</span>
          </div>
        </div>
      </div>
    </div>
  )
}