import { PlanFeature } from "./PlanFeature"

interface PlanCardProps {
  plan: {
    id: number
    name: string
    price: number
    cpu: number
    ram: number
    storage: number
    bandwidth: number
    ipv4: number
  }
  style: {
    color: string
    description: string
    popular?: boolean
  }
  onSelect: (planName: string) => void
}

export function PlanCard({ plan, style, onSelect }: PlanCardProps) {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden transition-transform hover:scale-105 hover:shadow-xl relative">
      {style.popular && (
        <div className="absolute top-0 right-0 bg-purple-600 text-white text-sm font-bold px-3 py-1">
          Popular
        </div>
      )}
      <div className={`p-8 border-b border-gray-700 ${style.popular ? 'bg-gradient-to-br from-gray-800 to-gray-900' : ''}`}>
        <h3 className="text-2xl font-bold text-white mb-4">{plan.name}</h3>
        <div className="flex items-baseline mb-4">
          <span className="text-4xl font-bold text-white">{plan.price} créditos</span>
        </div>
        <p className="text-gray-300">{style.description}</p>
      </div>
      <div className="p-8">
        <ul className="space-y-4 mb-8">
          <PlanFeature 
            label=""
            value={plan.cpu}
            unit="vCPUs"
            color={style.color}
          />
          <PlanFeature 
            label=""
            value={plan.ram}
            unit="GB RAM"
            color={style.color}
          />
          <PlanFeature 
            label=""
            value={plan.storage}
            unit="GB SSD"
            color={style.color}
          />
          <PlanFeature 
            label="Transferencia"
            value={plan.bandwidth / 1000}
            unit="TB al mes"
            color={style.color}
          />
          <PlanFeature 
            label=""
            value={plan.ipv4}
            unit="Dirección IPv4"
            color={style.color}
          />
        </ul>
        <button 
          onClick={() => onSelect(plan.name)}
          className={`w-full bg-${style.color}-600 hover:bg-${style.color}-700 text-white py-3 px-4 rounded-lg font-medium transition-colors`}
        >
          Seleccionar Plan
        </button>
      </div>
    </div>
  )
}