import { useQuotes } from '../../hooks/useQuotes'
import type { Quote } from '../../types'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { format } from 'date-fns'
import { Download } from 'lucide-react'
import { pdf } from '@react-pdf/renderer'
import QuotePDF from '../../components/pdf/QuotePDF'

function statusVariant(s: Quote['status']): 'default' | 'info' | 'success' | 'danger' | 'gold' {
  const map: Record<Quote['status'], 'default' | 'info' | 'success' | 'danger' | 'gold'> = {
    draft: 'default', sent: 'info', accepted: 'success', declined: 'danger', converted: 'gold'
  }
  return map[s]
}

export default function ContractorQuotes() {
  const { quotes, loading, updateQuote } = useQuotes()

  const handleDownload = async (quote: Quote) => {
    const blob = await pdf(<QuotePDF quote={quote} />).toBlob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Quote-${quote.id.slice(0, 8)}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stronghold-black">My Quotes</h1>
        <p className="text-stronghold-gray text-sm">{quotes.length} total</p>
      </div>

      <Card>
        {loading ? (
          <div className="p-8 text-center text-stronghold-gray">Loading...</div>
        ) : quotes.length === 0 ? (
          <div className="p-8 text-center text-stronghold-gray">No quotes yet</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Total</th>
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Date</th>
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Notes</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {quotes.map(q => (
                <tr key={q.id} className="hover:bg-stronghold-lightgray/50">
                  <td className="px-6 py-4"><Badge label={q.status} variant={statusVariant(q.status)} /></td>
                  <td className="px-6 py-4 text-sm font-medium text-stronghold-black">${q.subtotal.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-stronghold-gray">
                    {q.createdAt ? format(new Date(q.createdAt as unknown as string), 'MMM d, yyyy') : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-stronghold-gray max-w-xs truncate">{q.notes || '—'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      {q.status === 'sent' && (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => updateQuote(q.id, { status: 'accepted' })}>Accept</Button>
                          <Button variant="danger" size="sm" onClick={() => updateQuote(q.id, { status: 'declined' })}>Decline</Button>
                        </>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => handleDownload(q)}><Download size={14} /></Button>
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
