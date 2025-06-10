import { useEffect, useState } from 'react'
import { Cpu, Database, HardDrive, Network, Shield, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/services/api'
import { planStyles } from '@/config/plans'
import { PlanCard } from '@/components/ui/PlanCard'

interface Plan {
  id: number
  name: string
  price: number
  cpu: number
  ram: number
  storage: number
  bandwidth: number
  ipv4: number
}

export default function Plans() {
  const navigate = useNavigate()
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await api.get('/plans')
        setPlans(data)
      } catch (error) {
        console.error('Error loading plans:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [])

  const handleSelectPlan = (planName: string) => {
    navigate(`/adquire?plan=${planName.toLowerCase()}`)
  }

  if (loading) {
    return (
      <div className="bg-[#030712] min-h-screen text-gray-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  return (
    <div className="bg-[#030712] min-h-screen text-gray-200">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-[#0f172a] py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Planes VPS</h1>
            <p className="text-xl md:text-2xl text-gray-300">
              Servidores virtuales de alto rendimiento para todas tus necesidades
            </p>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan) => {
                const style = planStyles[plan.name as keyof typeof planStyles]
                return (
                  <PlanCard 
                    key={plan.id}
                    plan={plan}
                    style={style}
                    onSelect={handleSelectPlan}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Todos nuestros planes incluyen</h2>
            <p className="text-xl text-gray-300">
              Características premium diseñadas para un rendimiento óptimo
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-800 p-6 rounded-lg">
                <div className="w-12 h-12 bg-cyan-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Cpu className="h-6 w-6 text-cyan-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Procesadores de última generación</h3>
                <p className="text-gray-300">
                  CPUs Intel Xeon o AMD Opteron de alto rendimiento para todas tus aplicaciones.
                </p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                  <HardDrive className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Almacenamiento mecánico de alta velocidad</h3>
                <p className="text-gray-300">
                  Discos mecánicos a 7200RPM para máxima velocidad de lectura/escritura.
                </p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <div className="w-12 h-12 bg-emerald-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Network className="h-6 w-6 text-emerald-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Red de 1 Gbps</h3>
                <p className="text-gray-300">
                  Conexión de red de alta velocidad para transferencias rápidas y baja latencia.
                </p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <div className="w-12 h-12 bg-sky-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-sky-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Protección DDoS</h3>
                <p className="text-gray-300">
                  Protección avanzada contra ataques DDoS incluida sin costo adicional (con el aprendizaje de Movistar y LaLiga sobre Cloudflare).
                </p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <div className="w-12 h-12 bg-cyan-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-cyan-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Copias de seguridad</h3>
                <p className="text-gray-300">
                  Backups automáticos semanales para mantener tus datos seguros (nadie sabe a dónde van esos datos).
                </p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Soporte 24/7</h3>
                <p className="text-gray-300">
                  Asistencia técnica disponible 3,42 días del año para resolver cualquier problema.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 md:p-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">¿Necesitas un plan personalizado?</h2>
              <p className="text-xl text-gray-300 mb-8">
                Contáctanos para crear una solución a medida que se adapte perfectamente a tus necesidades específicas.
              </p>
              <button className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium text-lg transition-colors">
                Contactar a Ventas
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#030712] text-white py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-6">NubeServ</h2>
              <p className="mb-8 text-gray-400">
                Calle de la Iglesia s/n, 30012<br />
                contacto@nubeserv.com | +34 658 114 578
              </p>
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} NubeServ. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
