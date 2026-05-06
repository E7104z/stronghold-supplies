import { Link } from 'react-router-dom'
import { CheckCircle, Droplets, Layers, ArrowRight, Box } from 'lucide-react'

interface Product {
  id: number
  image: string
  name: string
  series: string
  color: string | null
  thickness: string
  wearLayer: string
  size: string | null
  padAttached: boolean
  features: string[]
  pricePerSqFt: number
  sqFtPerCase: number
  planksPerCase: number | null
  pricePerCase: number
}

const products: Product[] = [
  {
    id: 1,
    image: '/plank1.png',
    name: 'Bayou Grey',
    series: 'Click LVP — Pad Attached',
    color: 'Bayou Grey',
    thickness: '4.5mm',
    wearLayer: '12 mil',
    size: '7" × 48"',
    padAttached: true,
    features: ['100% Waterproof', 'Scratch Resistant'],
    pricePerSqFt: 2.79,
    sqFtPerCase: 26.15,
    planksPerCase: 11,
    pricePerCase: 72.99,
  },
  {
    id: 2,
    image: '/plank2.png',
    name: 'Click LVP Premium',
    series: 'Click LVP — Pad Attached',
    color: null,
    thickness: '5.5mm',
    wearLayer: '20 mil',
    size: '7" × 60"',
    padAttached: true,
    features: ['100% Waterproof'],
    pricePerSqFt: 3.75,
    sqFtPerCase: 28.84,
    planksPerCase: null,
    pricePerCase: 108.15,
  },
  {
    id: 3,
    image: '/Plank3.png',
    name: 'Kool Grey',
    series: 'A-Z FC1017-17 — Pad Attached',
    color: 'Kool Grey',
    thickness: '5mm',
    wearLayer: '12 mil',
    size: null,
    padAttached: true,
    features: ['100% Waterproof'],
    pricePerSqFt: 2.79,
    sqFtPerCase: 23.64,
    planksPerCase: null,
    pricePerCase: 66.00,
  },
  {
    id: 4,
    image: '/plank4.png',
    name: 'Portland Pine',
    series: 'Dura Lux Luxury Vinyl Click',
    color: 'Portland Pine',
    thickness: '5mm',
    wearLayer: '12 mil',
    size: null,
    padAttached: true,
    features: ['100% Waterproof'],
    pricePerSqFt: 2.79,
    sqFtPerCase: 25.52,
    planksPerCase: null,
    pricePerCase: 71.21,
  },
]

function fmt(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function Products() {
  return (
    <div>
      {/* Header */}
      <div className="bg-stronghold-black py-16 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 bg-cover bg-center"
          style={{ backgroundImage: 'url(/hero.png)' }}
        />
        <div className="relative max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-white mb-3">Our Product Catalog</h1>
          <p className="text-stronghold-gray max-w-xl">
            Premium luxury vinyl plank flooring with pad attached — wholesale pricing open to everyone.
            Homeowners, contractors, builders, and investors all welcome.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14">

        {/* Product grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Product image */}
              <div className="relative bg-gray-50 h-64 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.padAttached && (
                  <span className="absolute top-3 left-3 bg-stronghold-black/80 text-stronghold-cream text-xs font-medium px-2.5 py-1 rounded-full">
                    Pad Attached
                  </span>
                )}
                <span className="absolute top-3 right-3 bg-stronghold-red text-white text-sm font-bold px-3 py-1.5 rounded-full">
                  ${fmt(product.pricePerSqFt)}/sq ft
                </span>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1 gap-5">
                {/* Name & series */}
                <div>
                  <p className="text-xs text-stronghold-gray uppercase tracking-wider mb-1">{product.series}</p>
                  <h3 className="text-xl font-bold text-stronghold-black">{product.name}</h3>
                  {product.color && (
                    <p className="text-sm text-stronghold-gray mt-0.5">Color: {product.color}</p>
                  )}
                </div>

                {/* Spec grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-stronghold-lightgray rounded-xl px-3 py-3 text-center">
                    <Layers size={14} className="text-stronghold-red mx-auto mb-1" />
                    <div className="text-xs text-stronghold-gray mb-0.5">Thickness</div>
                    <div className="text-sm font-bold text-stronghold-black">{product.thickness}</div>
                  </div>
                  <div className="bg-stronghold-lightgray rounded-xl px-3 py-3 text-center">
                    <Droplets size={14} className="text-stronghold-red mx-auto mb-1" />
                    <div className="text-xs text-stronghold-gray mb-0.5">Wear Layer</div>
                    <div className="text-sm font-bold text-stronghold-black">{product.wearLayer}</div>
                  </div>
                  <div className="bg-stronghold-lightgray rounded-xl px-3 py-3 text-center">
                    <Box size={14} className="text-stronghold-red mx-auto mb-1" />
                    <div className="text-xs text-stronghold-gray mb-0.5">Coverage</div>
                    <div className="text-sm font-bold text-stronghold-black">{product.sqFtPerCase} sq ft</div>
                  </div>
                </div>

                {/* Details row */}
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-stronghold-gray">
                  {product.size && (
                    <span>Plank size: <span className="text-stronghold-black font-medium">{product.size}</span></span>
                  )}
                  {product.planksPerCase && (
                    <span>Planks/case: <span className="text-stronghold-black font-medium">{product.planksPerCase}</span></span>
                  )}
                </div>

                {/* Feature tags */}
                {product.features.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {product.features.map(f => (
                      <span key={f} className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2.5 py-1 rounded-full font-medium">
                        <CheckCircle size={11} /> {f}
                      </span>
                    ))}
                  </div>
                )}

                {/* Pricing footer */}
                <div className="mt-auto border-t border-gray-100 pt-4 flex items-end justify-between">
                  <div>
                    <div className="text-xs text-stronghold-gray mb-1">Per case ({product.sqFtPerCase} sq ft)</div>
                    <div className="text-2xl font-bold text-stronghold-black">${fmt(product.pricePerCase)}</div>
                    <div className="text-sm text-stronghold-red font-medium">${fmt(product.pricePerSqFt)} per sq ft</div>
                  </div>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 bg-stronghold-red text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-stronghold-darkred transition-colors"
                  >
                    Order Now <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-stronghold-gray mt-10 mb-4">
          Additional colorways and products available — contact us for the full selection.
        </p>

        {/* CTA */}
        <div className="mt-6 bg-stronghold-black rounded-2xl p-10 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">Ready to place an order?</h3>
          <p className="text-stronghold-gray mb-6 max-w-md mx-auto">
            Create a free account and get instant access to live pricing, quotes, and online order management.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/contact" className="bg-stronghold-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-stronghold-darkred transition-colors">
              Create an Account
            </Link>
            <Link to="/login" className="border border-stronghold-gray text-stronghold-cream px-6 py-3 rounded-lg font-semibold hover:border-stronghold-cream transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
