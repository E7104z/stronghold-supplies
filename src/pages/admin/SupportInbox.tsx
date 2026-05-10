import { useState } from 'react'
import { MessageSquare, Mail, Clock, CheckCircle, XCircle, Send, ChevronRight } from 'lucide-react'
import { useSupport } from '../../hooks/useSupport'
import type { SupportMessage } from '../../types'
import Badge from '../../components/ui/Badge'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { format } from 'date-fns'
import { toDate } from '../../lib/dateUtils'

type Filter = 'open' | 'replied' | 'closed' | 'all'

function statusVariant(s: SupportMessage['status']): 'warning' | 'success' | 'default' {
  return s === 'open' ? 'warning' : s === 'replied' ? 'success' : 'default'
}

const filters: { key: Filter; label: string; icon: typeof Clock }[] = [
  { key: 'all', label: 'All', icon: MessageSquare },
  { key: 'open', label: 'Open', icon: Clock },
  { key: 'replied', label: 'Replied', icon: CheckCircle },
  { key: 'closed', label: 'Closed', icon: XCircle },
]

export default function SupportInbox() {
  const { messages, loading, updateStatus, reply } = useSupport()
  const [filter, setFilter] = useState<Filter>('open')
  const [selected, setSelected] = useState<SupportMessage | null>(null)
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)

  const filtered = filter === 'all' ? messages : messages.filter(m => m.status === filter)

  const counts = {
    all: messages.length,
    open: messages.filter(m => m.status === 'open').length,
    replied: messages.filter(m => m.status === 'replied').length,
    closed: messages.filter(m => m.status === 'closed').length,
  }

  const handleSelect = (msg: SupportMessage) => {
    setSelected(msg)
    setReplyText('')
  }

  const handleReply = async () => {
    if (!selected || !replyText.trim()) return
    setSending(true)
    await reply(selected.id, replyText.trim())
    setSelected(m => m ? { ...m, adminReply: replyText.trim(), status: 'replied' } : m)
    setReplyText('')
    setSending(false)
  }

  const handleClose = async (id: string) => {
    await updateStatus(id, 'closed')
    setSelected(m => m ? { ...m, status: 'closed' } : m)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stronghold-black">Support Inbox</h1>
        <p className="text-stronghold-gray text-sm">
          {counts.open} open message{counts.open !== 1 ? 's' : ''} requiring attention
        </p>
      </div>

      <div className="flex gap-6 h-full">
        {/* Left: message list */}
        <div className="w-80 shrink-0 flex flex-col gap-3">
          {/* Filter tabs */}
          <div className="flex gap-1 bg-stronghold-lightgray rounded-lg p-1">
            {filters.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
                  filter === f.key
                    ? 'bg-white text-stronghold-black shadow-sm'
                    : 'text-stronghold-gray hover:text-stronghold-black'
                }`}
              >
                {f.label}
                {f.key !== 'all' && counts[f.key] > 0 && (
                  <span className={`rounded-full px-1.5 py-0 font-bold ${
                    f.key === 'open' ? 'text-stronghold-red' : 'text-stronghold-gray'
                  }`}>
                    {counts[f.key]}
                  </span>
                )}
              </button>
            ))}
          </div>

          <Card className="overflow-hidden">
            {loading ? (
              <div className="p-6 text-center text-sm text-stronghold-gray">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare size={28} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm text-stronghold-gray">No messages</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {filtered.map(msg => (
                  <li
                    key={msg.id}
                    onClick={() => handleSelect(msg)}
                    className={`p-4 cursor-pointer transition-colors hover:bg-stronghold-lightgray/60 ${
                      selected?.id === msg.id ? 'bg-stronghold-lightgray/80 border-l-2 border-stronghold-red' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="font-medium text-sm text-stronghold-black truncate">{msg.contractorName}</div>
                      <Badge label={msg.status} variant={statusVariant(msg.status)} />
                    </div>
                    <div className="text-xs font-medium text-stronghold-gray truncate mb-0.5">{msg.subject}</div>
                    <div className="text-xs text-stronghold-gray/70 truncate">{msg.message}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-stronghold-gray/60">
                        {toDate(msg.createdAt) ? format(toDate(msg.createdAt)!, 'MMM d, h:mm a') : '—'}
                      </span>
                      <ChevronRight size={12} className="text-stronghold-gray/40" />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        {/* Right: message detail */}
        <div className="flex-1 min-w-0">
          {!selected ? (
            <div className="flex items-center justify-center h-64 text-center">
              <div>
                <MessageSquare size={40} className="mx-auto mb-3 text-gray-200" />
                <p className="text-stronghold-gray text-sm">Select a message to view details</p>
              </div>
            </div>
          ) : (
            <Card className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-5 pb-5 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge label={selected.status} variant={statusVariant(selected.status)} />
                    <span className="text-xs text-stronghold-gray">
                      {toDate(selected.createdAt) ? format(toDate(selected.createdAt)!, 'MMMM d, yyyy h:mm a') : '—'}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-stronghold-black">{selected.subject}</h2>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm text-stronghold-gray font-medium">{selected.contractorName}</span>
                    <a href={`mailto:${selected.email}`} className="text-sm text-stronghold-red hover:underline flex items-center gap-1">
                      <Mail size={12} /> {selected.email}
                    </a>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  {selected.status !== 'closed' && (
                    <button
                      onClick={() => handleClose(selected.id)}
                      className="text-xs text-stronghold-gray hover:text-stronghold-black border border-gray-200 rounded-lg px-3 py-1.5 hover:border-stronghold-black transition-colors flex items-center gap-1"
                    >
                      <XCircle size={12} /> Close
                    </button>
                  )}
                </div>
              </div>

              {/* Message body */}
              <div className="mb-6">
                <div className="text-xs font-medium text-stronghold-gray uppercase tracking-wider mb-2">Message</div>
                <div className="bg-stronghold-lightgray rounded-xl p-4 text-sm text-stronghold-black whitespace-pre-wrap leading-relaxed">
                  {selected.message}
                </div>
              </div>

              {/* Existing reply */}
              {selected.adminReply && (
                <div className="mb-6">
                  <div className="text-xs font-medium text-stronghold-gray uppercase tracking-wider mb-2">Your reply</div>
                  <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-sm text-stronghold-black whitespace-pre-wrap leading-relaxed">
                    {selected.adminReply}
                  </div>
                  {toDate(selected.repliedAt) && (
                    <div className="text-xs text-stronghold-gray mt-1 pl-1">
                      Sent {format(toDate(selected.repliedAt)!, 'MMM d, yyyy h:mm a')}
                    </div>
                  )}
                </div>
              )}

              {/* Reply form */}
              {selected.status !== 'closed' && (
                <div>
                  <div className="text-xs font-medium text-stronghold-gray uppercase tracking-wider mb-2">
                    {selected.adminReply ? 'Send another reply' : 'Reply'}
                  </div>
                  <textarea
                    rows={4}
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Type your reply to this customer..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stronghold-red resize-none"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xs text-stronghold-gray">
                      This will be visible to the customer in their portal.
                    </p>
                    <Button onClick={handleReply} disabled={!replyText.trim() || sending}>
                      <Send size={14} /> {sending ? 'Sending...' : 'Send Reply'}
                    </Button>
                  </div>
                </div>
              )}

              {selected.status === 'closed' && (
                <div className="text-sm text-stronghold-gray text-center py-4 border border-gray-100 rounded-xl">
                  This conversation is closed.
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
