"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import { Layout } from "@/components/ui/Layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"

export default function AdquirePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const token = localStorage.getItem('token')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedPlan, setSelectedPlan] = useState<PlanName | "">("")
  const [selectedOS, setSelectedOS] = useState<"ubuntu" | "almalinux">("ubuntu")
  const [credits, setCredits] = useState<number>(0)

  const planDetails = {
    Basic: {
      price: "500 créditos",
      cpu: 2,
      ram: 4,
      storage: 50,
      transfer: "Transferencia infinita",
      color: "cyan",
    },
    "Mid-size": {
      price: "1000 créditos",
      cpu: 4,
      ram: 8,
      storage: 100,
      transfer: "Transferencia infinita",
      color: "purple",
    },
    Power: {
      price: "1500 créditos",
      cpu: 8,
      ram: 16,
      storage: 200,
      transfer: "Transferencia infinita",
      color: "emerald",
    },
  }

  type PlanName = keyof typeof planDetails;

  const canAffordPlan = (planName: PlanName): boolean => {
    if (!selectedPlan) return true
    const planPrice = parseInt(planDetails[planName].price.split(" ")[0])
    return credits >= planPrice
  }

  const getPlanWarning = (planName: PlanName): string | null => {
    if (!selectedPlan) return null
    const planPrice = parseInt(planDetails[planName].price.split(" ")[0])
    if (credits < planPrice) {
      return `Necesitas ${planPrice - credits} créditos más para este plan`
    }
    return null
  }

  // Redirect to auth if no token
  useEffect(() => {
    if (!token) {
      navigate('/auth', { 
        state: { 
          returnTo: location.pathname + location.search,
          message: "Debes iniciar sesión para adquirir un VPS" 
        }
      })
    }
  }, [token, navigate, location])

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await axios.get("/api/clients/credits", {
          headers: { Authorization: `Bearer ${token}` }
        })
        setCredits(response.data.credits)
      } catch (error) {
        console.error("Error fetching credits:", error)
      }
    }

    if (token) {
      fetchCredits()
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const selectedPlanDetails = planDetails[selectedPlan as keyof typeof planDetails]
    
    try {
      const response = await axios.post("/api/vps/create", 
        {
          cpu: selectedPlanDetails.cpu,
          ram: selectedPlanDetails.ram * 1024,
          disk: `${selectedPlanDetails.storage}G`,
          distro: selectedOS,
          plan_id: getPlanId(selectedPlan)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.data.success) {
        navigate("/dashboard")
      } else {
        setError(response.data.error || "Error al crear el VPS")
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        navigate('/auth')
      }
      setError(err.response?.data?.error || "Error al crear el VPS")
    } finally {
      setLoading(false)
    }
  }

  const getPlanId = (planName: string): number => {
    const planMap: Record<string, number> = {
      "Basic": 1,
      "Mid-size": 2,
      "Power": 3
    }
    return planMap[planName] || 1
  }

  return (
    <Layout>
      {token ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold text-white mb-2">Tu Saldo</h2>
            <p className="text-2xl font-bold text-cyan-500">{credits} créditos</p>
          </div>
          <Card className="mb-6">
            <Card.Header>
              <Card.Title>Sistema Operativo</Card.Title>
            </Card.Header>
            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                <div
                  className={`p-6 rounded-lg border-2 cursor-pointer transition-colors text-center ${
                    selectedOS === "ubuntu"
                      ? "border-cyan-500 bg-cyan-500/10"
                      : "border-gray-700 hover:border-gray-600"
                  }`}
                  onClick={() => setSelectedOS("ubuntu")}
                >
                  <img 
                    src="/ubuntu-logo.png" 
                    alt="Ubuntu" 
                    className="h-16 mx-auto mb-4"
                  />
                  <h3 className="text-lg font-semibold">Ubuntu 24.04</h3>
                  <p className="text-sm text-gray-400 mt-2">LTS Release</p>
                </div>
                <div
                  className={`p-6 rounded-lg border-2 cursor-pointer transition-colors text-center ${
                    selectedOS === "almalinux"
                      ? "border-cyan-500 bg-cyan-500/10"
                      : "border-gray-700 hover:border-gray-600"
                  }`}
                  onClick={() => setSelectedOS("almalinux")}
                >
                  <img 
                    src="/almalinux-logo.png" 
                    alt="AlmaLinux" 
                    className="h-16 mx-auto mb-4"
                  />
                  <h3 className="text-lg font-semibold">AlmaLinux 9</h3>
                  <p className="text-sm text-gray-400 mt-2">Enterprise Linux</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="mb-6">
            <Card.Header>
              <Card.Title>Plan Seleccionado</Card.Title>
            </Card.Header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(Object.entries(planDetails) as [PlanName, typeof planDetails[PlanName]][]).map(([planName, details]) => {
                const warning = getPlanWarning(planName)
                return (
                  <div
                    key={planName}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      selectedPlan === planName
                        ? canAffordPlan(planName)
                          ? "border-cyan-500 bg-cyan-500/10"
                          : "border-red-500 bg-red-500/10"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                    onClick={() => setSelectedPlan(planName)}
                  >
                    <h3 className="text-lg font-semibold">{planName}</h3>
                    <p className="text-2xl font-bold mt-2">
                      {details.price}
                      <span className="text-sm text-gray-400 font-normal">/mes</span>
                    </p>
                    <div className="mt-3 space-y-1 text-sm text-gray-400">
                      <p>{details.cpu} vCPUs</p>
                      <p>{details.ram} GB RAM</p>
                      <p>{details.storage} GB SSD</p>
                      <p>{details.transfer}</p>
                    </div>
                    {warning && (
                      <p className="mt-2 text-sm text-red-400">{warning}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </Card>

          {error && (
            <div className="mt-4 bg-red-900/30 border border-red-700 text-red-100 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <Card.Footer>
            <Button
              type="submit"
              isLoading={loading}
              disabled={loading || !selectedPlan || !canAffordPlan(selectedPlan as PlanName)}
              className="w-full"
            >
              {!selectedPlan 
                ? "Selecciona un plan" 
                : !canAffordPlan(selectedPlan)
                ? "Saldo insuficiente"
                : "Crear VPS"}
            </Button>
          </Card.Footer>
        </form>
      ) : null}
    </Layout>
  )
}

