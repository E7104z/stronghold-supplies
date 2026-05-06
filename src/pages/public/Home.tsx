import { Link } from 'react-router-dom'
import { Shield, Package, TrendingUp, Truck, ArrowRight, CheckCircle } from 'lucide-react'

const features = [
  {
    icon: <Package size={28} className="text-stronghold-red" />,
    title: 'Premium LVP Flooring',
    desc: 'We carry top-tier luxury vinyl plank in a wide range of thicknesses, wear layers, and colorways sourced from industry-leading manufacturers.'
  },
  {
    icon: <Shield size={28} className="text-stronghold-red" />,
    title: 'Wholesale Pricing — Open to All',
    desc: 'We sell to everyone — homeowners, contractors, builders, and investors alike. No markups, no membership fees. Just honest wholesale pricing on premium LVP.'
  },
  {
    icon: <TrendingUp size={28} className="text-stronghold-red" />,
    title: 'Built for Every Project',
    desc: 'Whether you\'re flipping one house or managing dozens of jobs, our portal keeps your quotes, orders, and invoices organized from first contact to final payment.'
  },
  {
    icon: <Truck size={28} className="text-stronghold-red" />,
    title: 'Fast Pickup & Delivery',
    desc: 'Flexible pickup scheduling and reliable delivery options to keep your project moving without delays or last-minute supply issues.'
  },
]

const whyUs = [
  'Open to everyone — homeowners, contractors & builders',
  'Consistent stock across popular colorways',
  'Dedicated account management',
  'Transparent per-sqft pricing',
  'Digital quotes and invoices',
  'Fast order turnaround',
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-stronghold-black relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/hero.png)' }} />
        <div className="absolute inset-0 bg-stronghold-black/70" />
        <div className="relative max-w-7xl mx-auto px-6 py-28 md:py-36 flex flex-col items-start gap-6">
          <div className="inline-flex items-center gap-2 bg-stronghold-darkred/40 border border-stronghold-red/30 rounded-full px-4 py-1.5">
            <span className="w-2 h-2 rounded-full bg-stronghold-red animate-pulse" />
            <span className="text-stronghold-cream text-xs font-medium tracking-wider uppercase">Premium Flooring — Wholesale Prices</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight max-w-3xl">
            Premium LVP.<br />
            <span className="text-stronghold-red">Wholesale Pricing.</span><br />
            For Everyone.
          </h1>
          <p className="text-stronghold-gray text-lg max-w-xl leading-relaxed">
            Strong Hold Supplies is your local wholesale flooring source — open to homeowners, contractors, builders, and investors. Competitive pricing, reliable stock, and a seamless ordering experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-stronghold-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-stronghold-darkred transition-colors"
            >
              Get in Touch <ArrowRight size={18} />
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 border border-stronghold-gray text-stronghold-cream px-6 py-3 rounded-lg font-semibold hover:border-stronghold-cream transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-stronghold-black mb-3">Why customers choose us</h2>
          <p className="text-stronghold-gray max-w-xl mx-auto">Whether it's one room or a hundred, we make it easy to get premium LVP at wholesale prices — no middleman, no hassle.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map(f => (
            <div key={f.title} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex gap-5">
              <div className="flex-shrink-0 mt-1">{f.icon}</div>
              <div>
                <h3 className="text-lg font-semibold text-stronghold-black mb-2">{f.title}</h3>
                <p className="text-stronghold-gray text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why us checklist */}
      <section className="bg-stronghold-lightgray py-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-stronghold-black mb-4">The Strong Hold difference</h2>
            <p className="text-stronghold-gray leading-relaxed mb-8">
              We're not a big-box store. We're a dedicated wholesale flooring supplier open to anyone — homeowners, contractors, builders, and real estate investors. Great product at prices that make sense.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-stronghold-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-stronghold-darkred transition-colors"
            >
              Get Started <ArrowRight size={18} />
            </Link>
          </div>
          <div className="flex-1 grid grid-cols-1 gap-3">
            {whyUs.map(item => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle size={18} className="text-stronghold-red flex-shrink-0" />
                <span className="text-stronghold-black text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-stronghold-black mb-4">Ready to get started?</h2>
        <p className="text-stronghold-gray mb-8 max-w-lg mx-auto">
          Reach out today and we'll get you set up with an account and access to our full product catalog and wholesale pricing.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 bg-stronghold-red text-white px-8 py-3 rounded-lg font-semibold hover:bg-stronghold-darkred transition-colors"
        >
          Contact Us <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  )
}
