import { useInvoices } from '../../hooks/useInvoices'
import type { Invoice } from '../../types'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { format } from 'date-fns'
import { Download, CheckCircle } from 'lucide-react'
import { pdf } from '@react-pdf/renderer'
import InvoicePDF from '../../components/pdf/InvoicePDF'

function statusVariant(s: Invoice['status']): 'default' | 'success' | 'danger' {
  return s === 'paid' ? 'success' : s === 'overdue' ? 'danger' : 'default'
}

export default function Invoices() {
  const { invoices, loading, markPaid } = useInvoices()

  const handleDownload = async (invoice: Invoice) => {
    const blob = await pdf(<InvoicePDF invoice={invoice} />).toBlob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${invoice.invoiceNumber}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  const totals = invoices.reduce((acc, inv) => ({
    total: acc.total + inv.total,
    paid: acc.paid + (inv.status === 'paid' ? inv.total : 0),
    unpaid: acc.unpaid + (inv.status !== 'paid' ? inv.total : 0),
  }), { total: 0, paid: 0, unpaid: 0 })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stronghold-black">Invoices</h1>
        <p className="text-stronghold-gray text-sm">{invoices.length} total</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border-l-4 border-stronghold-red shadow-sm">
          <div className="text-stronghold-gray text-xs mb-1">Total Invoiced</div>
          <div className="text-xl font-bold text-stronghold-black">${totals.total.toFixed(2)}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border-l-4 border-green-500 shadow-sm">
          <div className="text-stronghold-gray text-xs mb-1">Paid</div>
          <div className="text-xl font-bold text-green-600">${totals.paid.toFixed(2)}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border-l-4 border-stronghold-gold shadow-sm">
          <div className="text-stronghold-gray text-xs mb-1">Outstanding</div>
          <div className="text-xl font-bold text-stronghold-black">${totals.unpaid.toFixed(2)}</div>
        </div>
      </div>

      <Card>
        {loading ? (
          <div className="p-8 text-center text-stronghold-gray">Loading...</div>
        ) : invoices.length === 0 ? (
          <div className="p-8 text-center text-stronghold-gray">No invoices yet</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Invoice #</th>
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Contractor</th>
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Total</th>
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Due Date</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-stronghold-lightgray/50">
                  <td className="px-6 py-4 text-sm font-mono font-medium text-stronghold-black">{inv.invoiceNumber}</td>
                  <td className="px-6 py-4 text-sm text-stronghold-gray">{inv.contractorName}</td>
                  <td className="px-6 py-4"><Badge label={inv.status} variant={statusVariant(inv.status)} /></td>
                  <td className="px-6 py-4 text-sm font-medium text-stronghold-black">${inv.total.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-stronghold-gray">
                    {inv.dueDate ? format(new Date(inv.dueDate as unknown as string), 'MMM d, yyyy') : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      {inv.status !== 'paid' && (
                        <Button variant="ghost" size="sm" onClick={() => markPaid(inv.id)}>
                          <CheckCircle size={14} /> Mark Paid
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => handleDownload(inv)}>
                        <Download size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  )
}
