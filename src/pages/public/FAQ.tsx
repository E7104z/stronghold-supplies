import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'

const faqs = [
  {
    q: 'Who can buy from Strong Hold Supplies?',
    a: 'Anyone! We sell to homeowners, flooring contractors, builders, real estate investors, property managers, and anyone else who needs quality LVP flooring at wholesale prices. All we ask is that you create an account so we can get you set up with pricing.'
  },
  {
    q: 'How do I set up an account?',
    a: 'Fill out our contact form with your information. We typically review and approve accounts within 1 business day. Once approved, you\'ll receive login credentials to our ordering portal where you can view pricing and place orders.'
  },
  {
    q: 'What types of flooring do you carry?',
    a: 'We specialize in luxury vinyl plank (LVP) flooring across a range of thicknesses (from 6mm to 12mm+), wear layers (12mil, 20mil, and higher), and colorways. Our catalog is updated regularly — browse our Products page to see what\'s currently in stock.'
  },
  {
    q: 'How is pricing structured?',
    a: 'All pricing is per square foot at wholesale rates — the same price whether you\'re a homeowner buying one room or a contractor buying for an entire development. Pricing is visible to approved accounts logged into our portal.'
  },
  {
    q: 'Can I get a quote before committing to an order?',
    a: 'Yes. Through our portal, you can create detailed quotes with line items, square footage, and current pricing. Quotes are available as a PDF and can be converted to an order when you\'re ready.'
  },
  {
    q: 'What are my pickup and delivery options?',
    a: 'We offer flexible pickup scheduling at our location. Delivery options are available — contact us with your job location and order size for delivery availability and pricing.'
  },
  {
    q: 'How do invoices work?',
    a: 'Invoices are generated automatically when an order is marked complete. They\'re available in PDF format through your account portal and include full line-item detail, totals, and payment due dates.'
  },
  {
    q: 'What if a product is out of stock?',
    a: 'Our inventory page shows live stock status. If a product you need is out of stock, contact us — we may have incoming stock on the way or can suggest a comparable alternative.'
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        onClick={() => setOpen(o => !o)}
      >
        <span className="font-medium text-stronghold-black text-sm md:text-base">{q}</span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 text-stronghold-gray transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="pb-5 text-stronghold-gray text-sm leading-relaxed">{a}</div>
      )}
    </div>
  )
}

export default function FAQ() {
  return (
    <div>
      {/* Header */}
      <div className="bg-stronghold-black py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-white mb-3">Frequently Asked Questions</h1>
          <p className="text-stronghold-gray max-w-xl">
            Everything you need to know about working with Strong Hold Supplies.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-8">
          {faqs.map(faq => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-semibold text-stronghold-black mb-2">Still have questions?</h3>
          <p className="text-stronghold-gray text-sm mb-6">We're happy to help. Reach out directly and we'll get back to you quickly.</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-stronghold-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-stronghold-darkred transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}
