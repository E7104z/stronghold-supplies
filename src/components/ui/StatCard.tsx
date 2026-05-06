interface StatCardProps {
  label: string
  value: string
  sub?: string
  icon: React.ReactNode
  accent?: 'red' | 'gold' | 'green'
}

export default function StatCard({ label, value, sub, icon, accent = 'red' }: StatCardProps) {
  const accentMap = {
    red: 'border-stronghold-red',
    gold: 'border-stronghold-gold',
    green: 'border-green-500'
  }
  return (
    <div className={`bg-white rounded-xl p-6 border-l-4 ${accentMap[accent]} shadow-sm`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-stronghold-gray text-sm">{label}</span>
        <span className="text-stronghold-gray">{icon}</span>
      </div>
      <div className="text-2xl font-bold text-stronghold-black">{value}</div>
      {sub && <div className="text-xs text-stronghold-gray mt-1">{sub}</div>}
    </div>
  )
}
