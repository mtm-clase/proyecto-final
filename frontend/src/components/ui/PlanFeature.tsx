import { Check } from "lucide-react"

interface PlanFeatureProps {
  label: string
  value: string | number
  unit?: string
  color: string
}

export function PlanFeature({ label, value, unit = "", color }: PlanFeatureProps) {
  return (
    <li className="flex items-start">
      <Check className={`h-5 w-5 text-${color}-500 mr-3 mt-0.5`} />
      <span className="text-gray-300">
        {label}{" "}
        <strong className="text-white">
          {value}
          {unit && ` ${unit}`}
        </strong>
      </span>
    </li>
  )
}