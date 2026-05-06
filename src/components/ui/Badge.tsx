type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'gold'

interface BadgeProps {
  label: string
  variant?: BadgeVariant
}

const variantMap: Record<BadgeVariant, string> = {
  default:  'bg-gray-100 text-gray-600',
  success:  'bg-green-100 text-green-700',
  warning:  'bg-yellow-100 text-yellow-700',
  danger:   'bg-red-100 text-red-700',
  info:     'bg-blue-100 text-blue-700',
  gold:     'bg-yellow-50 text-yellow-800',
}

export default function Badge({ label, variant = 'default' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantMap[variant]}`}>
      {label}
    </span>
  )
}
