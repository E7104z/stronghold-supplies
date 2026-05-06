import { useOrders } from '../../hooks/useOrders'
import type { Order } from '../../types'
import Badge from '../../components/ui/Badge'
import Card from '../../components/ui/Card'
import { format } from 'date-fns'

const statusLabel: Record<Order['status'], string> = {
  pending: 'Pending', confirmed: 'Confirmed', picked_up: 'Picked Up', delivered: 'Delivered', complete: 'Complete'
}

function statusVariant(s: Order['status']): 'default' | 'info' | 'warning' | 'success' | 'gold' {
  const map: Record<Order['status'], 'default' | 'info' | 'warning' | 'success' | 'gold'> = {
    pending: 'default', confirmed: 'info', picked_up: 'warning', delivered: 'gold', complete: 'success'
  }
  return map[s]
}

export default function ContractorOrders() {
  const { orders, loading } = useOrders()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stronghold-black">My Orders</h1>
        <p className="text-stronghold-gray text-sm">{orders.length} total</p>
      </div>

      <Card>
        {loading ? (
          <div className="p-8 text-center text-stronghold-gray">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-stronghold-gray">No orders yet</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Sq Ft</th>
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Total</th>
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Created</th>
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map(o => (
                <tr key={o.id} className="hover:bg-stronghold-lightgray/50">
                  <td className="px-6 py-4"><Badge label={statusLabel[o.status]} variant={statusVariant(o.status)} /></td>
                  <td className="px-6 py-4 text-sm text-stronghold-gray">{o.totalSqFt.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm font-medium text-stronghold-black">${o.totalRevenue.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-stronghold-gray">
                    {o.createdAt ? format(new Date(o.createdAt as unknown as string), 'MMM d, yyyy') : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-stronghold-gray max-w-xs truncate">{o.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  )
}
