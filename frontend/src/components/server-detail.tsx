interface ServerDetailProps {
  label: string
  value: string | number
  isMono?: boolean
  isLast?: boolean
}

export function ServerDetail({ label, value, isMono = false, isLast = false }: ServerDetailProps) {
  return (
    <div className={`flex justify-between py-2 ${!isLast ? 'border-b border-gray-700' : ''}`}>
      <span className="text-gray-400">{label}</span>
      <span className={`text-white ${isMono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  )
}