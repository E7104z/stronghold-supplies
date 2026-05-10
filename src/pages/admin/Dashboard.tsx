import { useMemo } from 'react'
import { DollarSign, TrendingUp, FileText, ShoppingCart, Receipt } from 'lucide-react'
import { startOfMonth } from 'date-fns'
import { toDate } from '../../lib/dateUtils'
import StatCard from '../../components/ui/StatCard'
import { useInvoices } from '../../hooks/useInvoices'
import { useOrders } from '../../hooks/useOrders'
import { useQuotes } from '../../hooks/useQuotes'

function fmt(n: number) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function Dashboard() {
  const { invoices } = useInvoices()
  const { orders } = useOrders()
  const { quotes } = useQuotes()

  const monthStart = startOfMonth(new Date())

  const stats = useMemo(() => {
    const paidThisMonth = invoices
      .filter(inv => inv.status === 'paid' && inv.paidAt && (toDate(inv.paidAt) ?? new Date(0)) >= monthStart)
      .reduce((s, inv) => s + inv.total, 0)

    const marginThisMonth = orders
      .filter(o => o.status === 'complete' && o.createdAt && (toDate(o.createdAt) ?? new Date(0)) >= monthStart)
      .reduce((s, o) => s + o.totalMargin, 0)

    const openQuotes = quotes.filter(q => q.status === 'sent').length
    const activeOrders = orders.filter(o => o.status !== 'complete').length
    const unpaidInvoices = invoices.filter(inv => inv.status === 'unpaid' || inv.status === 'overdue')
    const unpaidTotal = unpaidInvoices.reduce((s, inv) => s + inv.total, 0)

    return { paidThisMonth, marginThisMonth, openQuotes, activeOrders, unpaidInvoices: unpaidInvoices.length, unpaidTotal }
  }, [invoices, orders, quotes])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stronghold-black">Dashboard</h1>
        <p className="text-stronghold-gray text-sm mt-1">Welcome back — here's what's happening this month.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <StatCard
          label="Revenue This Month"
          value={fmt(stats.paidThisMonth)}
          sub="From paid invoices"
          icon={<DollarSign size={20} />}
          accent="green"
        />
        <StatCard
          label="Margin This Month"
          value={fmt(stats.marginThisMonth)}
          sub="From completed orders"
          icon={<TrendingUp size={20} />}
          accent="gold"
        />
        <StatCard
          label="Open Quotes"
          value={String(stats.openQuotes)}
          sub="Awaiting response"
          icon={<FileText size={20} />}
          accent="red"
        />
        <StatCard
          label="Active Orders"
          value={String(stats.activeOrders)}
          sub="In progress"
          icon={<ShoppingCart size={20} />}
          accent="red"
        />
        <StatCard
          label="Unpaid Invoices"
          value={fmt(stats.unpaidTotal)}
          sub={`${stats.unpaidInvoices} invoice${stats.unpaidInvoices !== 1 ? 's' : ''} outstanding`}
          icon={<Receipt size={20} />}
          accent="gold"
        />
      </div>
    </div>
  )
}
