import { useMemo } from 'react'
import { useOrders } from '../../hooks/useOrders'
import Card from '../../components/ui/Card'
import { format, startOfMonth, startOfQuarter, startOfYear } from 'date-fns'

function fmt(n: number) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function MarginTracker() {
  const { orders, loading } = useOrders()

  const completed = useMemo(() => orders.filter(o => o.status === 'complete'), [orders])

  const calc = (items: typeof completed) => {
    const revenue = items.reduce((s, o) => s + o.totalRevenue, 0)
    const cost = items.reduce((s, o) => s + o.totalCost, 0)
    const margin = revenue - cost
    const pct = revenue > 0 ? (margin / revenue) * 100 : 0
    const sqFt = items.reduce((s, o) => s + o.totalSqFt, 0)
    const marginPerSqFt = sqFt > 0 ? margin / sqFt : 0
    return { revenue, cost, margin, pct, sqFt, marginPerSqFt }
  }

  const now = new Date()
  const periods = [
    { label: 'This Month', items: completed.filter(o => new Date(o.createdAt as unknown as string) >= startOfMonth(now)) },
    { label: 'This Quarter', items: completed.filter(o => new Date(o.createdAt as unknown as string) >= startOfQuarter(now)) },
    { label: 'This Year', items: completed.filter(o => new Date(o.createdAt as unknown as string) >= startOfYear(now)) },
    { label: 'All Time', items: completed },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stronghold-black">Margin Tracker</h1>
        <p className="text-stronghold-gray text-sm">Profitability across completed orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {periods.map(({ label, items }) => {
          const s = calc(items)
          return (
            <Card key={label} className="p-6">
              <h3 className="font-semibold text-stronghold-black mb-4">{label}</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-stronghold-gray">Revenue</span>
                  <span className="font-medium">{fmt(s.revenue)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stronghold-gray">Cost</span>
                  <span className="font-medium">{fmt(s.cost)}</span>
                </div>
                <div className="flex justify-between text-sm border-t pt-3">
                  <span className="text-stronghold-gray">Gross Margin</span>
                  <span className="font-bold text-green-600">{fmt(s.margin)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stronghold-gray">Margin %</span>
                  <span className="font-bold text-green-600">{s.pct.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stronghold-gray">Total Sq Ft</span>
                  <span className="font-medium">{s.sqFt.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stronghold-gray">Margin / Sq Ft</span>
                  <span className="font-medium">${s.marginPerSqFt.toFixed(3)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stronghold-gray">Orders</span>
                  <span className="font-medium">{items.length}</span>
                </div>
              </div>
              {s.revenue > 0 && (
                <div className="mt-4">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all"
                      style={{ width: `${Math.min(s.pct, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-stronghold-gray mt-1">{s.pct.toFixed(1)}% margin rate</div>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      <Card>
        <div className="p-6">
          <h3 className="font-semibold text-stronghold-black mb-4">Order Breakdown</h3>
        </div>
        {loading ? (
          <div className="p-8 text-center text-stronghold-gray">Loading...</div>
        ) : completed.length === 0 ? (
          <div className="p-8 text-center text-stronghold-gray">No completed orders yet</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Contractor</th>
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Date</th>
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Sq Ft</th>
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Revenue</th>
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Cost</th>
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Margin $</th>
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Margin %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {completed.map(o => {
                const pct = o.totalRevenue > 0 ? (o.totalMargin / o.totalRevenue) * 100 : 0
                return (
                  <tr key={o.id} className="hover:bg-stronghold-lightgray/50">
                    <td className="px-6 py-4 text-sm font-medium text-stronghold-black">{o.contractorName}</td>
                    <td className="px-6 py-4 text-sm text-stronghold-gray">
                      {o.createdAt ? format(new Date(o.createdAt as unknown as string), 'MMM d, yyyy') : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-stronghold-gray">{o.totalSqFt.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-stronghold-gray">{fmt(o.totalRevenue)}</td>
                    <td className="px-6 py-4 text-sm text-stronghold-gray">{fmt(o.totalCost)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-green-600">{fmt(o.totalMargin)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-green-600">{pct.toFixed(1)}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  )
}
