import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FilePlus, X, ExternalLink, ChevronRight,
  Building2, Mail, Phone, MapPin, Package, Ruler, CalendarDays, MessageSquare,
} from 'lucide-react'
import { useQuoteRequests } from '../../hooks/useQuoteRequests'
import type { QuoteRequest } from '../../types'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { format } from 'date-fns'

type Filter = 'all' | QuoteRequest['status']

function statusVariant(s: QuoteRequest['status']): 'warning' | 'info' | 'gold' | 'success' | 'default' {
  const map = { new: 'warning', reviewing: 'info', quoted: 'gold', closed: 'default' } as const
  return map[s]
}

const filters: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'new', label: 'New' },
  { key: 'reviewing', label: 'Reviewing' },
  { key: 'quoted', label: 'Quoted' },
  { key: 'closed', label: 'Closed' },
]

export default function QuoteRequests() {
  const { requests, loading, updateRequest } = useQuoteRequests()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState<QuoteRequest | null>(null)

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter)

  const counts: Record<Filter, number> = {
    all: requests.length,
    new: requests.filter(r => r.status === 'new').length,
    reviewing: requests.filter(r => r.status === 'reviewing').length,
    quoted: requests.filter(r => r.status === 'quoted').length,
    closed: requests.filter(r => r.status === 'closed').length,
  }

  const handleStatusChange = async (id: string, status: QuoteRequest['status']) => {
    await updateRequest(id, { status })
    if (selected?.id === id) setSelected(r => r ? { ...r, status } : r)
  }

  const handleCreateQuote = (req: QuoteRequest) => {
    navigate('/admin/quotes', { state: { prefill: req } })
  }

  return (
    <div className="flex gap-6 h-full">
      {/* Main table */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-stronghold-black">Quote Requests</h1>
            <p className="text-stronghold-gray text-sm">{counts.new} new request{counts.new !== 1 ? 's' : ''} awaiting review</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 mb-4 bg-stronghold-lightgray rounded-lg p-1 w-fit">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                filter === f.key
                  ? 'bg-white text-stronghold-black shadow-sm'
                  : 'text-stronghold-gray hover:text-stronghold-black'
              }`}
            >
              {f.label}
              {counts[f.key] > 0 && (
                <span className={`text-xs rounded-full px-1.5 py-0.5 font-semibold ${
                  f.key === 'new' && counts.new > 0
                    ? 'bg-stronghold-red text-white'
                    : 'bg-gray-200 text-stronghold-gray'
                }`}>
                  {counts[f.key]}
                </span>
              )}
            </button>
          ))}
        </div>

        <Card>
          {loading ? (
            <div className="p-8 text-center text-stronghold-gray">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <FilePlus size={36} className="mx-auto mb-3 text-gray-300" />
              <p className="text-stronghold-gray text-sm">No requests found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Customer</th>
                  <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Product Interest</th>
                  <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Sq Ft</th>
                  <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Delivery</th>
                  <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-stronghold-gray uppercase tracking-wider px-6 py-3">Received</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(req => (
                  <tr
                    key={req.id}
                    className={`hover:bg-stronghold-lightgray/50 cursor-pointer transition-colors ${selected?.id === req.id ? 'bg-stronghold-lightgray/70' : ''}`}
                    onClick={() => setSelected(req)}
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-stronghold-black">{req.contractorName}</div>
                      <div className="text-xs text-stronghold-gray">{req.companyName}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-stronghold-gray max-w-[160px] truncate">{req.productInterest}</td>
                    <td className="px-6 py-4 text-sm text-stronghold-gray">{req.estimatedSqFt?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-stronghold-gray">{req.desiredDelivery || '—'}</td>
                    <td className="px-6 py-4"><Badge label={req.status} variant={statusVariant(req.status)} /></td>
                    <td className="px-6 py-4 text-sm text-stronghold-gray">
                      {req.createdAt ? format(new Date(req.createdAt as unknown as string), 'MMM d, yyyy') : '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ChevronRight size={16} className="text-stronghold-gray inline" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>

      {/* Detail drawer */}
      {selected && (
        <div className="w-96 shrink-0">
          <Card className="p-6 sticky top-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <Badge label={selected.status} variant={statusVariant(selected.status)} />
                <h2 className="text-lg font-bold text-stronghold-black mt-2">{selected.contractorName}</h2>
                <p className="text-sm text-stronghold-gray">{selected.companyName}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-stronghold-gray hover:text-stronghold-black">
                <X size={18} />
              </button>
            </div>

            {/* Contact info */}
            <div className="space-y-2 mb-5 pb-5 border-b border-gray-100">
              <div className="flex items-center gap-2 text-sm text-stronghold-gray">
                <Mail size={14} className="shrink-0" />
                <a href={`mailto:${selected.email}`} className="hover:text-stronghold-red truncate">{selected.email}</a>
              </div>
              <div className="flex items-center gap-2 text-sm text-stronghold-gray">
                <Phone size={14} className="shrink-0" />
                {selected.phone || '—'}
              </div>
              {selected.projectAddress && (
                <div className="flex items-start gap-2 text-sm text-stronghold-gray">
                  <MapPin size={14} className="shrink-0 mt-0.5" />
                  {selected.projectAddress}
                </div>
              )}
            </div>

            {/* Request details */}
            <div className="space-y-3 mb-5 pb-5 border-b border-gray-100">
              <div className="flex items-start gap-2">
                <Package size={14} className="text-stronghold-gray shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-stronghold-gray">Product interest</div>
                  <div className="text-sm font-medium text-stronghold-black">{selected.productInterest}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Ruler size={14} className="text-stronghold-gray shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-stronghold-gray">Estimated sq ft</div>
                  <div className="text-sm font-medium text-stronghold-black">{selected.estimatedSqFt?.toLocaleString() || '—'}</div>
                </div>
              </div>
              {selected.desiredDelivery && (
                <div className="flex items-start gap-2">
                  <CalendarDays size={14} className="text-stronghold-gray shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-stronghold-gray">Desired delivery</div>
                    <div className="text-sm font-medium text-stronghold-black">{selected.desiredDelivery}</div>
                  </div>
                </div>
              )}
              {selected.notes && (
                <div className="flex items-start gap-2">
                  <MessageSquare size={14} className="text-stronghold-gray shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-stronghold-gray">Notes</div>
                    <div className="text-sm text-stronghold-black">{selected.notes}</div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-stronghold-gray">
                <Building2 size={12} />
                Received {selected.createdAt ? format(new Date(selected.createdAt as unknown as string), 'MMM d, yyyy h:mm a') : '—'}
              </div>
            </div>

            {/* Status update */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-stronghold-gray uppercase tracking-wider mb-2">Update status</label>
              <div className="grid grid-cols-2 gap-2">
                {(['new', 'reviewing', 'quoted', 'closed'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(selected.id, s)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors capitalize ${
                      selected.status === s
                        ? 'bg-stronghold-black text-white border-stronghold-black'
                        : 'border-gray-200 text-stronghold-gray hover:border-stronghold-black hover:text-stronghold-black'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Button className="w-full justify-center" onClick={() => handleCreateQuote(selected)}>
                <ExternalLink size={14} /> Create Quote from Request
              </Button>
              <Button variant="secondary" className="w-full justify-center" onClick={() => setSelected(null)}>
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
