"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { VpsManager } from "@/components/VpsManager"
import { ClientManager } from "@/components/ClientManager"
import { ProfileCard } from "@/components/profile-card"

export default function Dashboard() {
  const navigate = useNavigate()

  const [userRole, setUserRole] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"vps" | "clients">("vps")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/auth")
      return
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      setUserRole(payload.role)
      setUserId(payload.id)
    } catch (e) {
      console.error("Error decodificando token:", e)
      navigate("/auth")
    }
  }, [navigate])

  return (
    <div className="bg-[#030712] min-h-screen text-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Panel de Control</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("vps")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === "vps"
                  ? "bg-cyan-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              VPS
            </button>
            <button
              onClick={() => setActiveTab("clients")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === "clients"
                  ? "bg-cyan-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Perfiles
            </button>
          </div>
        </div>

        {activeTab === "vps" ? (
          <VpsManager userRole={userRole} userId={userId} />
        ) : userRole === "admin" ? (
          <ClientManager userRole={userRole} />
        ) : (
          <ProfileCard />
        )}
      </div>
    </div>
  )
}

