import { useState } from 'react'
import { Plus, Send, RefreshCw, Download } from 'lucide-react'
import { useQuotes } from '../../hooks/useQuotes'
import { useContractors } from '../../hooks/useContractors'
import { useInventory } from '../../hooks/useInventory'
import type { Quote, LineItem } from '../../types'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Card from '../../components/ui/Card'
import { format } from 'date-fns'
import { pdf } from '@react-pdf/renderer'
import QuotePDF from '../../components/pdf/QuotePDF'

function statusVariant(s: Quote['status']): 'default' | 'info' | 'success' | 'danger' | 'warning' | 'gold' {
  const map: Record<Quote['status'], 'default' | 'info' | 'success' | 'danger' | 'warning' | 'gold'> = {
    draft: 'default', sent: 'info', accepted: 'success', declined: 'danger', converted: 'gold'
  }
  return map[s]
}

const emptyLine: LineItem = { inventoryId: '', description: '', sqFt: 0, costPerSqFt: 0, sellPerSqFt: 0, total: 0 }

export default function Quotes() {
  const { quotes, loading, addQuote, updateQuote, convertToOrder } = useQuotes()
  const { contractors } = useContractors()
  const { inventory } = useInventory()
  const [modal, setModal] = useState<'add' | 'view' | null>(null)
  const [contractorId, setContractorId] = useState('')
  const [lineItems, setLineItems] = useState<LineItem[]>([{ ...emptyLine }])
  const [notes, setNotes] = useState('')

  const totals = lineItems.reduce((acc, li) => ({
    subtotal: acc.subtotal + li.total,
    cost: acc.cost + li.costPerSqFt * li.sqFt,
  }), { subtotal: 0, cost: 0 })

  const updateLine = (idx: number, key: keyof LineItem, value: string | number) => {
    setLineItems(lines => lines.map((l, i) => {
      if (i !== idx) return l
      const updated = { ...l, [key]: value }
      if (key === 'inventoryId') {
        const inv = inventory.find(item => item.id === value)
        if (inv) {
          updated.description = inv.name
          updated.costPerSqFt = inv.costPerSqFt
        }
      }
      updated.total = updated.sellPerSqFt * updated.sqFt
      return updated
    }))
  }

  const handleCreate = async () => {
    const contractor = contractors.find(c => c.id === contractorId)
    if (!contractor) return
    await addQuote({
      contractorId,
      contractorName: contractor.name,
      status: 'draft',
      lineItems,
      subtotal: totals.subtotal,
      totalCost: totals.cost,
      totalMargin: totals.subtotal - totals.cost,
      notes,
    })
    setModal(null)
    setLineItems([{ ...emptyLine }])
    setNotes('')
    setContractorId('')
  }

  const handleDownloadPDF = async (quote: Quote) => {
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stronghold-black">Quotes</h1>
          <p className="text-stronghold-gray text-sm">{quotes.length} total</p>
        </div>
        <Button onClick={() => setModal('add')}><Plus size={16} /> New Quote</Button>
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
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Contractor</th>
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Total</th>
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Margin</th>
                <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Created</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {quotes.map(q => (
                <tr key={q.id} className="hover:bg-stronghold-lightgray/50">
                  <td className="px-6 py-4 text-sm font-medium text-stronghold-black">{q.contractorName}</td>
                  <td className="px-6 py-4"><Badge label={q.status} variant={statusVariant(q.status)} /></td>
                  <td className="px-6 py-4 text-sm text-stronghold-gray">${q.subtotal.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-stronghold-gray">${q.totalMargin.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-stronghold-gray">
                    {q.createdAt ? format(new Date(q.createdAt as unknown as string), 'MMM d, yyyy') : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      {q.status === 'draft' && (
                        <Button variant="ghost" size="sm" onClick={() => updateQuote(q.id, { status: 'sent' })}><Send size={14} /> Send</Button>
                      )}
                      {q.status === 'accepted' && (
                        <Button variant="ghost" size="sm" onClick={() => convertToOrder(q)}><RefreshCw size={14} /> Convert</Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => handleDownloadPDF(q)}><Download size={14} /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {modal === 'add' && (
        <Modal title="New Quote" onClose={() => setModal(null)} size="xl">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stronghold-black mb-1">Contractor</label>
              <select
                value={contractorId}
                onChange={e => setContractorId(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stronghold-red"
              >
                <option value="">Select contractor...</option>
                {contractors.filter(c => c.status === 'active').map(c => (
                  <option key={c.id} value={c.id}>{c.name} — {c.companyName}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-stronghold-black">Line Items</label>
                <Button variant="ghost" size="sm" onClick={() => setLineItems(l => [...l, { ...emptyLine }])}><Plus size={14} /> Add Line</Button>
              </div>
              <div className="space-y-2">
                {lineItems.map((li, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-3">
                      <select
                        value={li.inventoryId}
                        onChange={e => updateLine(idx, 'inventoryId', e.target.value)}
                        className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-stronghold-red"
                      >
                        <option value="">Select product...</option>
                        {inventory.filter(i => i.inStock).map(i => (
                          <option key={i.id} value={i.id}>{i.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-3">
                      <input placeholder="Description" value={li.description} onChange={e => updateLine(idx, 'description', e.target.value)}
                        className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-stronghold-red" />
                    </div>
                    <div className="col-span-2">
                      <input type="number" placeholder="Sq Ft" value={li.sqFt || ''} onChange={e => updateLine(idx, 'sqFt', parseFloat(e.target.value) || 0)}
                        className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-stronghold-red" />
                    </div>
                    <div className="col-span-2">
                      <input type="number" placeholder="Cost/sqft" value={li.costPerSqFt || ''} onChange={e => updateLine(idx, 'costPerSqFt', parseFloat(e.target.value) || 0)}
                        className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-stronghold-red" />
                    </div>
                    <div className="col-span-2">
                      <input type="number" placeholder="Sell/sqft" value={li.sellPerSqFt || ''} onChange={e => updateLine(idx, 'sellPerSqFt', parseFloat(e.target.value) || 0)}
                        className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-stronghold-red" />
                    </div>
                    <div className="col-span-1 text-xs text-right text-stronghold-gray font-medium">${li.total.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-8 text-sm border-t pt-4">
              <div><span className="text-stronghold-gray">Subtotal: </span><span className="font-semibold">${totals.subtotal.toFixed(2)}</span></div>
              <div><span className="text-stronghold-gray">Cost: </span><span className="font-semibold">${totals.cost.toFixed(2)}</span></div>
              <div><span className="text-stronghold-gray">Margin: </span><span className="font-semibold text-green-600">${(totals.subtotal - totals.cost).toFixed(2)}</span></div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stronghold-black mb-1">Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stronghold-red" />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!contractorId}>Create Quote</Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
