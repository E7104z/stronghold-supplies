import { useInvoices } from '../../hooks/useInvoices'
import type { Invoice } from '../../types'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { format } from 'date-fns'
import { toDate } from '../../lib/dateUtils'
import { Download, AlertCircle } from 'lucide-react'
import { pdf } from '@react-pdf/renderer'
import InvoicePDF from '../../components/pdf/InvoicePDF'

function statusVariant(s: Invoice['status']): 'default' | 'success' | 'danger' | 'warning' {
  return s === 'paid' ? 'success' : s === 'overdue' ? 'danger' : 'warning'
}

export default function ContractorInvoices() {
  const { invoices, loading } = useInvoices()

  const handleDownload = async (inv: Invoice) => {
    const blob = await pdf(<InvoicePDF invoice={inv} />).toBlob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Invoice-${inv.invoiceNumber}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  const unpaid = invoices.filter(i => i.status !== 'paid')
  const totalDue = unpaid.reduce((s, i) => s + i.total, 0)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stronghold-black">Invoices</h1>
        <p className="text-stronghold-gray text-sm">{invoices.length} total · {unpaid.length} outstanding</p>
      </div>

      {totalDue > 0 && (
        <div className="mb-6 bg-red-50 border-l-4 border-stronghold-red rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-stronghold-red shrink-0 mt-0.5" size={20} />
          <div>
            <div className="font-semibold text-stronghold-black">Outstanding balance: ${totalDue.toFixed(2)}</div>
            <div className="text-sm text-stronghold-gray">{unpaid.length} invoice{unpaid.length !== 1 ? 's' : ''} awaiting payment. Contact us to settle.</div>
          </div>
        </div>
      )}

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
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Total</th>
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Due</th>
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Created</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-stronghold-lightgray/50">
                  <td className="px-6 py-4 text-sm font-mono text-stronghold-black">{inv.invoiceNumber}</td>
                  <td className="px-6 py-4"><Badge label={inv.status} variant={statusVariant(inv.status)} /></td>
                  <td className="px-6 py-4 text-sm font-semibold text-stronghold-black">${inv.total.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-stronghold-gray">
                    {inv.dueDate ? format(new Date(inv.dueDate as unknown as string), 'MMM d, yyyy') : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-stronghold-gray">
                    {toDate(inv.createdAt) ? format(toDate(inv.createdAt)!, 'MMM d, yyyy') : '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleDownload(inv)}>
                      <Download size={14} /> PDF
                    </Button>
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
