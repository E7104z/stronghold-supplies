import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useQuoteRequests } from '../../hooks/useQuoteRequests'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { FilePlus, Package } from 'lucide-react'
import { format } from 'date-fns'
import { toDate } from '../../lib/dateUtils'
import type { QuoteRequest } from '../../types'

function statusVariant(s: QuoteRequest['status']): 'default' | 'success' | 'warning' | 'info' {
  return s === 'new' ? 'warning' : s === 'reviewing' ? 'info' : s === 'quoted' ? 'success' : 'default'
}

export default function ContractorRequestQuote() {
  const { user } = useAuth()
  const { requests, loading, submitRequest } = useQuoteRequests()
  const [form, setForm] = useState({
    productInterest: '',
    estimatedSqFt: '',
    projectAddress: '',
    desiredDelivery: '',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSubmitting(true)
    try {
      await submitRequest({
        contractorId: user.uid,
        contractorName: user.name,
        companyName: user.companyName ?? '',
        email: user.email,
        phone: user.phone ?? '',
        productInterest: form.productInterest.trim(),
        estimatedSqFt: Number(form.estimatedSqFt) || 0,
        projectAddress: form.projectAddress.trim(),
        desiredDelivery: form.desiredDelivery.trim(),
        notes: form.notes.trim(),
      })
      setForm({ productInterest: '', estimatedSqFt: '', projectAddress: '', desiredDelivery: '', notes: '' })
    } catch { /* toast handled by hook */ }
    finally { setSubmitting(false) }
  }

  const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stronghold-red'

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stronghold-black">Request a Quote</h1>
        <p className="text-stronghold-gray text-sm">Tell us about your project — we'll prepare a custom quote</p>
      </div>

      <Card className="p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <FilePlus size={18} className="text-stronghold-red" />
          <h2 className="font-semibold text-stronghold-black">New quote request</h2>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-stronghold-gray uppercase tracking-wider mb-1">Product interest *</label>
            <input
              required
              value={form.productInterest}
              onChange={e => setForm(f => ({ ...f, productInterest: e.target.value }))}
              className={inputCls}
              placeholder="e.g., Bayou Grey LVP, Crest Oak, or 'undecided — open to suggestions'"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stronghold-gray uppercase tracking-wider mb-1">Estimated sq ft *</label>
            <input
              required type="number" min="1"
              value={form.estimatedSqFt}
              onChange={e => setForm(f => ({ ...f, estimatedSqFt: e.target.value }))}
              className={inputCls}
              placeholder="500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stronghold-gray uppercase tracking-wider mb-1">Desired delivery</label>
            <input
              value={form.desiredDelivery}
              onChange={e => setForm(f => ({ ...f, desiredDelivery: e.target.value }))}
              className={inputCls}
              placeholder="ASAP, or specific date"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-stronghold-gray uppercase tracking-wider mb-1">Project / delivery address</label>
            <input
              value={form.projectAddress}
              onChange={e => setForm(f => ({ ...f, projectAddress: e.target.value }))}
              className={inputCls}
              placeholder="Same as account address, or new"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-stronghold-gray uppercase tracking-wider mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              className={`${inputCls} min-h-[100px] resize-y`}
              placeholder="Any details about the project, timeline, color preferences, etc."
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit request'}
            </Button>
          </div>
        </form>
      </Card>

      <div>
        <h2 className="text-lg font-semibold text-stronghold-black mb-3">Your requests</h2>
        <Card>
          {loading ? (
            <div className="p-8 text-center text-stronghold-gray">Loading...</div>
          ) : requests.length === 0 ? (
            <div className="p-8 text-center text-stronghold-gray">No quote requests yet</div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {requests.map(r => (
                <li key={r.id} className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <Package size={16} className="text-stronghold-red" />
                      <div className="font-medium text-stronghold-black">{r.productInterest}</div>
                    </div>
                    <Badge label={r.status} variant={statusVariant(r.status)} />
                  </div>
                  <div className="text-sm text-stronghold-gray flex flex-wrap gap-x-4 gap-y-1">
                    <span>{r.estimatedSqFt} sq ft</span>
                    {r.desiredDelivery && <span>Delivery: {r.desiredDelivery}</span>}
                    {r.projectAddress && <span>· {r.projectAddress}</span>}
                  </div>
                  {r.notes && <p className="text-sm text-stronghold-gray mt-2 whitespace-pre-wrap">{r.notes}</p>}
                  <div className="text-xs text-stronghold-gray mt-2">
                    {toDate(r.createdAt) ? format(toDate(r.createdAt)!, 'MMM d, yyyy · h:mm a') : '—'}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}
