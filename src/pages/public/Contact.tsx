import { useState } from 'react'
import type { FormEvent } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import toast from 'react-hot-toast'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSending(true)
    try {
      await addDoc(collection(db, 'contacts'), {
        ...form,
        createdAt: serverTimestamp(),
        status: 'new',
      })
      setSent(true)
      toast.success('Message sent! We\'ll be in touch shortly.')
    } catch {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const setField = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-stronghold-red"

  return (
    <div>
      {/* Header */}
      <div className="bg-stronghold-black py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-white mb-3">Get in Touch</h1>
          <p className="text-stronghold-gray max-w-xl">
            Have a question or ready to place an order? Fill out the form and we'll get back to you within 1 business day.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Info */}
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-stronghold-black mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-stronghold-red mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-stronghold-black">Email</div>
                  <a href="mailto:info@strongholdsupplies.com" className="text-sm text-stronghold-gray hover:text-stronghold-red transition-colors">
                    info@strongholdsupplies.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-stronghold-red mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-stronghold-black">Phone</div>
                  <span className="text-sm text-stronghold-gray">Contact us for details</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-stronghold-red mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-stronghold-black">Serving</div>
                  <span className="text-sm text-stronghold-gray">Homeowners, contractors & builders across the region</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-stronghold-black rounded-xl p-6">
            <h3 className="font-semibold text-white mb-3">What happens next?</h3>
            <ol className="space-y-2">
              {[
                'We review your inquiry within 1 business day',
                'We set up your account',
                'You get access to live pricing and our portal',
                'Place your first order',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-stronghold-gray">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-stronghold-darkred text-white text-xs flex items-center justify-center font-medium mt-0.5">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          {sent ? (
            <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send size={24} className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-stronghold-black mb-2">Message Received!</h3>
              <p className="text-stronghold-gray text-sm max-w-sm mx-auto">
                Thanks for reaching out. We'll review your inquiry and get back to you within 1 business day.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-stronghold-black mb-1">Full Name *</label>
                  <input required value={form.name} onChange={setField('name')} className={inputClass} placeholder="John Smith" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stronghold-black mb-1">Company / Organization</label>
                  <input value={form.company} onChange={setField('company')} className={inputClass} placeholder="Optional" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-stronghold-black mb-1">Email *</label>
                  <input required type="email" value={form.email} onChange={setField('email')} className={inputClass} placeholder="john@smithflooring.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stronghold-black mb-1">Phone</label>
                  <input type="tel" value={form.phone} onChange={setField('phone')} className={inputClass} placeholder="(555) 000-0000" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stronghold-black mb-1">Message</label>
                <textarea
                  value={form.message}
                  onChange={setField('message')}
                  rows={5}
                  className={inputClass}
                  placeholder="Tell us what you're looking for — project size, product type, quantities, or any questions you have..."
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-stronghold-red text-white py-3 rounded-lg font-semibold hover:bg-stronghold-darkred transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send size={16} />
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
