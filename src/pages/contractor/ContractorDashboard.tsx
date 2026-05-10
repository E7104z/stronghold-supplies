import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useQuotes } from '../../hooks/useQuotes'
import { useOrders } from '../../hooks/useOrders'
import { useInvoices } from '../../hooks/useInvoices'
import { useQuoteRequests } from '../../hooks/useQuoteRequests'
import StatCard from '../../components/ui/StatCard'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import {
  FileText, ShoppingCart, Receipt, AlertCircle, ArrowRight,
  TrendingUp, Package, Clock, CheckCircle2, FilePlus,
  MessageSquare, BookOpen, Truck,
} from 'lucide-react'
import { format, isAfter, subDays } from 'date-fns'
import { toDate } from '../../lib/dateUtils'
import type { Order } from '../../types'

const statusLabel: Record<Order['status'], string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  picked_up: 'Picked Up',
  delivered: 'Delivered',
  complete: 'Complete',
}

function statusVariantOrder(s: Order['status']): 'default' | 'info' | 'warning' | 'success' | 'gold' {
  return s === 'complete' ? 'success' : s === 'delivered' ? 'gold' : s === 'picked_up' ? 'warning' : s === 'confirmed' ? 'info' : 'default'
}

const orderStages: Array<{ key: Order['status']; label: string }> = [
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'picked_up', label: 'Picked Up' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'complete', label: 'Complete' },
]
function stageIndex(s: Order['status']) { return orderStages.findIndex(x => x.key === s) }

export default function ContractorDashboard() {
  const { user } = useAuth()
  const { quotes } = useQuotes()
  const { orders } = useOrders()
  const { invoices } = useInvoices()
  const { requests } = useQuoteRequests()

  const stats = useMemo(() => {
    const thirtyDaysAgo = subDays(new Date(), 30)
    const recentOrders = orders.filter(o => { const d = toDate(o.createdAt); return d && isAfter(d, thirtyDaysAgo) })
    const lifetimeSpend = orders.reduce((s, o) => s + (o.totalRevenue ?? 0), 0)
    const ytdSpend = orders.filter(o => {
      if (!o.createdAt) return false
      return (toDate(o.createdAt)?.getFullYear() ?? -1) === new Date().getFullYear()
    }).reduce((s, o) => s + (o.totalRevenue ?? 0), 0)
    return {
      activeQuotes: quotes.filter(q => q.status === 'sent' || q.status === 'draft').length,
      pendingRequests: requests.filter(r => r.status !== 'closed').length,
      activeOrders: orders.filter(o => o.status !== 'complete').length,
      ordersLast30: recentOrders.length,
      unpaidInvoices: invoices.filter(i => i.status !== 'paid').length,
      unpaidTotal: invoices.filter(i => i.status !== 'paid').reduce((s, i) => s + i.total, 0),
      ytdSpend,
      lifetimeSpend,
    }
  }, [quotes, orders, invoices, requests])

  const activeOrdersList = useMemo(() => orders.filter(o => o.status !== 'complete').slice(0, 4), [orders])
  const pendingQuotes = useMemo(() => quotes.filter(q => q.status === 'sent').slice(0, 3), [quotes])

  // Activity feed - merge recent items from all sources
  const activity = useMemo(() => {
    type Item = { id: string; type: 'quote' | 'order' | 'invoice' | 'request'; label: string; sub: string; date: Date; href: string }
    const items: Item[] = []
    quotes.slice(0, 5).forEach(q => items.push({
      id: 'q-' + q.id, type: 'quote',
      label: `Quote ${q.status === 'sent' ? 'received' : q.status}`,
      sub: `$${q.subtotal?.toFixed(2) ?? '0.00'}`,
      date: toDate(q.createdAt) ?? new Date(0),
      href: '/portal/quotes',
    }))
    orders.slice(0, 5).forEach(o => items.push({
      id: 'o-' + o.id, type: 'order',
      label: `Order ${statusLabel[o.status]}`,
      sub: `${o.totalSqFt?.toLocaleString()} sq ft · $${o.totalRevenue?.toFixed(2) ?? '0.00'}`,
      date: toDate(o.createdAt) ?? new Date(0),
      href: '/portal/orders',
    }))
    invoices.slice(0, 5).forEach(i => items.push({
      id: 'i-' + i.id, type: 'invoice',
      label: `Invoice ${i.invoiceNumber} ${i.status}`,
      sub: `$${i.total?.toFixed(2) ?? '0.00'}`,
      date: toDate(i.createdAt) ?? new Date(0),
      href: '/portal/invoices',
    }))
    requests.slice(0, 5).forEach(r => items.push({
      id: 'r-' + r.id, type: 'request',
      label: `Quote request: ${r.productInterest}`,
      sub: `${r.estimatedSqFt} sq ft · ${r.status}`,
      date: toDate(r.createdAt) ?? new Date(0),
      href: '/portal/request-quote',
    }))
    return items.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 8)
  }, [quotes, orders, invoices, requests])

  const firstName = user?.name?.split(' ')[0] ?? 'there'

  return (
    <div>
      {/* Welcome banner */}
      <div className="bg-gradient-to-br from-stronghold-black to-stronghold-darkred rounded-2xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-cover bg-center" style={{ backgroundImage: 'url(/hero.png)' }} />
        <div className="relative">
          <div className="text-stronghold-cream/70 text-xs uppercase tracking-widest mb-1">Welcome back</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">Hi {firstName}</h1>
          <p className="text-stronghold-cream/80 text-sm">{user?.companyName || 'Your wholesale account'} — let's get you set up for success.</p>

          <div className="flex flex-wrap gap-3 mt-6">
            <Link to="/portal/request-quote">
              <button className="inline-flex items-center gap-2 bg-stronghold-red hover:bg-red-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors">
                <FilePlus size={16} /> Request a quote
              </button>
            </Link>
            <Link to="/products">
              <button className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors">
                <BookOpen size={16} /> Browse catalog
              </button>
            </Link>
            <Link to="/portal/support">
              <button className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors">
                <MessageSquare size={16} /> Contact us
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Outstanding balance alert */}
      {stats.unpaidTotal > 0 && (
        <div className="mb-6 bg-red-50 border-l-4 border-stronghold-red rounded-xl p-4 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-stronghold-red shrink-0 mt-0.5" size={22} />
            <div>
              <div className="font-semibold text-stronghold-black">Outstanding balance: ${stats.unpaidTotal.toFixed(2)}</div>
              <div className="text-sm text-stronghold-gray">{stats.unpaidInvoices} invoice{stats.unpaidInvoices !== 1 ? 's' : ''} awaiting payment</div>
            </div>
          </div>
          <Link to="/portal/invoices">
            <Button size="sm">View invoices <ArrowRight size={14} /></Button>
          </Link>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Active Quotes"
          value={String(stats.activeQuotes)}
          sub={stats.pendingRequests > 0 ? `+ ${stats.pendingRequests} request${stats.pendingRequests !== 1 ? 's' : ''} pending` : 'Awaiting your review'}
          icon={<FileText size={20} />}
          accent="red"
        />
        <StatCard
          label="Active Orders"
          value={String(stats.activeOrders)}
          sub={`${stats.ordersLast30} new in last 30 days`}
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
        <StatCard
          label="Year-to-Date Spend"
          value={`$${stats.ytdSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          sub={`Lifetime: $${stats.lifetimeSpend.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          icon={<TrendingUp size={20} />}
          accent="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active orders with progress */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Truck size={18} className="text-stronghold-red" />
                <h2 className="font-semibold text-stronghold-black">Active orders</h2>
              </div>
              <Link to="/portal/orders" className="text-sm text-stronghold-red font-medium hover:underline flex items-center gap-1">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            {activeOrdersList.length === 0 ? (
              <div className="text-center py-10 text-stronghold-gray">
                <Package size={36} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No active orders. <Link to="/portal/request-quote" className="text-stronghold-red hover:underline">Request a quote</Link> to get started.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {activeOrdersList.map(o => {
                  const idx = stageIndex(o.status)
                  return (
                    <div key={o.id} className="border border-gray-100 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3 gap-3">
                        <div>
                          <div className="text-xs text-stronghold-gray uppercase tracking-wider">Order · {toDate(o.createdAt) ? format(toDate(o.createdAt)!, 'MMM d') : '—'}</div>
                          <div className="font-semibold text-stronghold-black">${o.totalRevenue?.toFixed(2) ?? '0.00'} · {o.totalSqFt?.toLocaleString() ?? 0} sq ft</div>
                        </div>
                        <Badge label={statusLabel[o.status]} variant={statusVariantOrder(o.status)} />
                      </div>
                      {/* Progress timeline */}
                      <div className="flex items-center gap-1">
                        {orderStages.map((stage, i) => {
                          const reached = i <= idx
                          const isCurrent = i === idx
                          return (
                            <div key={stage.key} className="flex-1 flex items-center">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                                reached ? 'bg-stronghold-red text-white' : 'bg-gray-100 text-gray-400'
                              } ${isCurrent ? 'ring-2 ring-stronghold-red/30' : ''}`}>
                                {reached ? <CheckCircle2 size={12} /> : i + 1}
                              </div>
                              {i < orderStages.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-1 ${i < idx ? 'bg-stronghold-red' : 'bg-gray-100'}`} />
                              )}
                            </div>
                          )
                        })}
                      </div>
                      <div className="flex justify-between mt-1 text-[10px] text-stronghold-gray">
                        {orderStages.map(s => <span key={s.key} className="flex-1 text-center">{s.label}</span>)}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>

          {/* Pending quotes for review */}
          {pendingQuotes.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-stronghold-red" />
                  <h2 className="font-semibold text-stronghold-black">Quotes awaiting your review</h2>
                </div>
                <Link to="/portal/quotes" className="text-sm text-stronghold-red font-medium hover:underline flex items-center gap-1">
                  View all <ArrowRight size={14} />
                </Link>
              </div>
              <ul className="divide-y divide-gray-100">
                {pendingQuotes.map(q => (
                  <li key={q.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-medium text-stronghold-black">${q.subtotal.toFixed(2)}</div>
                      <div className="text-xs text-stronghold-gray truncate">{q.notes || 'No notes'}</div>
                    </div>
                    <div className="text-xs text-stronghold-gray shrink-0">
                      {toDate(q.createdAt) ? format(toDate(q.createdAt)!, 'MMM d') : '—'}
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {/* Right column: Recent activity + Quick info */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={18} className="text-stronghold-red" />
              <h2 className="font-semibold text-stronghold-black">Recent activity</h2>
            </div>
            {activity.length === 0 ? (
              <div className="text-center py-8 text-sm text-stronghold-gray">No activity yet</div>
            ) : (
              <ul className="space-y-3">
                {activity.map(item => (
                  <li key={item.id}>
                    <Link to={item.href} className="flex items-start gap-3 group">
                      <div className="w-8 h-8 rounded-full bg-stronghold-lightgray flex items-center justify-center shrink-0 group-hover:bg-stronghold-red/10 transition-colors">
                        {item.type === 'quote' && <FileText size={14} className="text-stronghold-gray group-hover:text-stronghold-red" />}
                        {item.type === 'order' && <ShoppingCart size={14} className="text-stronghold-gray group-hover:text-stronghold-red" />}
                        {item.type === 'invoice' && <Receipt size={14} className="text-stronghold-gray group-hover:text-stronghold-red" />}
                        {item.type === 'request' && <FilePlus size={14} className="text-stronghold-gray group-hover:text-stronghold-red" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm text-stronghold-black truncate">{item.label}</div>
                        <div className="text-xs text-stronghold-gray">{item.sub} · {item.date.getTime() > 0 ? format(item.date, 'MMM d') : '—'}</div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-stronghold-black mb-3">Need help?</h3>
            <p className="text-sm text-stronghold-gray mb-4">
              Our team typically responds within one business day. Send us a message anytime.
            </p>
            <Link to="/portal/support">
              <Button variant="secondary" className="w-full justify-center">
                <MessageSquare size={14} /> Contact support
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
