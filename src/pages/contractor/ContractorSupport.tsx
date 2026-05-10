import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useSupport } from '../../hooks/useSupport'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { MessageSquare, Mail, Phone, CheckCircle2 } from 'lucide-react'
import { format } from 'date-fns'
import { toDate } from '../../lib/dateUtils'

export default function ContractorSupport() {
  const { user } = useAuth()
  const { messages, loading, sendMessage } = useSupport()
  const [form, setForm] = useState({ subject: '', message: '' })
  const [sending, setSending] = useState(false)

  const handleSend = async (e: FormEvent) => {
    e.preventDefault()
    if (!user || !form.subject.trim() || !form.message.trim()) return
    setSending(true)
    try {
      await sendMessage({
        contractorId: user.uid,
        contractorName: user.name,
        email: user.email,
        subject: form.subject.trim(),
        message: form.message.trim(),
      })
      setForm({ subject: '', message: '' })
    } catch { /* toast handled by hook */ }
    finally { setSending(false) }
  }

  const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stronghold-red'

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stronghold-black">Support</h1>
        <p className="text-stronghold-gray text-sm">Get in touch — we usually respond within one business day</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare size={18} className="text-stronghold-red" />
            <h2 className="font-semibold text-stronghold-black">Send a message</h2>
          </div>
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stronghold-gray uppercase tracking-wider mb-1">Subject</label>
              <input
                value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                className={inputCls}
                placeholder="What can we help with?"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stronghold-gray uppercase tracking-wider mb-1">Message</label>
              <textarea
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                className={`${inputCls} min-h-[160px] resize-y`}
                placeholder="Tell us what's going on..."
                required
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={sending}>
                {sending ? 'Sending...' : 'Send message'}
              </Button>
            </div>
          </form>
        </Card>

        <Card className="p-6 h-fit">
          <h3 className="font-semibold text-stronghold-black mb-3">Other ways to reach us</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <Mail size={16} className="text-stronghold-red mt-0.5" />
              <div>
                <div className="text-stronghold-black font-medium">Email</div>
                <div className="text-stronghold-gray">info@stronghold-supplies.com</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone size={16} className="text-stronghold-red mt-0.5" />
              <div>
                <div className="text-stronghold-black font-medium">Phone</div>
                <div className="text-stronghold-gray">Call for fastest response</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-stronghold-black mb-3">Your conversations</h2>
        <Card>
          {loading ? (
            <div className="p-8 text-center text-stronghold-gray">Loading...</div>
          ) : messages.length === 0 ? (
            <div className="p-8 text-center text-stronghold-gray">No messages yet</div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {messages.map(m => (
                <li key={m.id} className="p-6">
                  <div className="flex items-start justify-between mb-2 gap-3">
                    <div className="font-medium text-stronghold-black">{m.subject}</div>
                    <Badge label={m.status} variant={m.status === 'open' ? 'warning' : m.status === 'replied' ? 'success' : 'default'} />
                  </div>
                  <p className="text-sm text-stronghold-gray whitespace-pre-wrap mb-2">{m.message}</p>
                  <div className="text-xs text-stronghold-gray">
                    {toDate(m.createdAt) ? format(toDate(m.createdAt)!, 'MMM d, yyyy · h:mm a') : '—'}
                  </div>
                  {m.adminReply && (
                    <div className="mt-4 bg-green-50 border border-green-100 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 size={14} className="text-green-600" />
                        <span className="text-xs font-semibold text-green-700 uppercase tracking-wider">Reply from Strong Hold</span>
                        {m.repliedAt && (
                          <span className="text-xs text-green-600/70 ml-auto">
                            {toDate(m.repliedAt) ? format(toDate(m.repliedAt)!, 'MMM d · h:mm a') : '—'}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-stronghold-black whitespace-pre-wrap">{m.adminReply}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}
