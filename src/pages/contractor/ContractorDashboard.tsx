import { useMemo } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useQuotes } from '../../hooks/useQuotes'
import { useOrders } from '../../hooks/useOrders'
import { useInvoices } from '../../hooks/useInvoices'
import StatCard from '../../components/ui/StatCard'
import { FileText, ShoppingCart, Receipt } from 'lucide-react'

export default function ContractorDashboard() {
  const { user } = useAuth()
  const { quotes } = useQuotes()
  const { orders } = useOrders()
  const { invoices } = useInvoices()

  const stats = useMemo(() => ({
    activeQuotes: quotes.filter(q => q.status === 'sent' || q.status === 'draft').length,
    activeOrders: orders.filter(o => o.status !== 'complete').length,
    unpaidInvoices: invoices.filter(i => i.status !== 'paid').length,
    unpaidTotal: invoices.filter(i => i.status !== 'paid').reduce((s, i) => s + i.total, 0),
  }), [quotes, orders, invoices])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stronghold-black">Welcome, {user?.name}</h1>
        <p className="text-stronghold-gray text-sm">{user?.companyName} — Contractor Portal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Active Quotes"
          value={String(stats.activeQuotes)}
          sub="Awaiting your review"
          icon={<FileText size={20} />}
          accent="red"
        />
        <StatCard
          label="Active Orders"
          value={String(stats.activeOrders)}
          sub="In progress"
          icon={<ShoppingCart size={20} />}
          accent="gold"
        />
        <StatCard
          label="Outstanding Balance"
          value={`$${stats.unpaidTotal.toFixed(2)}`}
          sub={`${stats.unpaidInvoices} unpaid invoice${stats.unpaidInvoices !== 1 ? 's' : ''}`}
          icon={<Receipt size={20} />}
          accent="red"
        />
      </div>
    </div>
  )
}
