import { useState, useEffect } from "react"
import { api } from "@/services/api"
import { User } from "lucide-react"

interface Profile {
  id: string
  name: string
  email: string
  company: string | null
  phone: string | null
  credits: number
}

export function ProfileCard() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: ""
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.get("/clients/profile")
        setProfile(data)
        setFormData({
          name: data.name || "",
          company: data.company || "",
          phone: data.phone || ""
        })
      } catch (error) {
        console.error("Error cargando perfil:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = await api.put("/clients/profile", formData)
      setProfile(data)
      setEditing(false)
    } catch (error) {
      console.error("Error actualizando perfil:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="bg-gray-700 p-3 rounded-full">
                <User className="h-6 w-6 text-cyan-400" />
              </div>
              <h2 className="ml-4 text-xl font-semibold text-white">Mi Perfil</h2>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Créditos disponibles</p>
              <p className="text-2xl font-bold text-cyan-400">{profile.credits}</p>
            </div>
          </div>

          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Nombre</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full p-2 rounded bg-gray-900 text-gray-400 border border-gray-700 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Empresa</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Teléfono</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-cyan-600 text-white hover:bg-cyan-700"
                >
                  Guardar
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-400">Nombre</p>
                <p className="text-white">{profile.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Email</p>
                <p className="text-white">{profile.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Empresa</p>
                <p className="text-white">{profile.company || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Teléfono</p>
                <p className="text-white">{profile.phone || "-"}</p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 rounded bg-cyan-600 text-white hover:bg-cyan-700"
                >
                  Editar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}