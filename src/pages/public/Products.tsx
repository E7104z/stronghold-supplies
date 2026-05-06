import { Link } from 'react-router-dom'
import { CheckCircle, Droplets, Layers, ArrowRight, Box } from 'lucide-react'

interface Product {
  id: number
  image: string
  name: string
  brand?: string
  sku?: string
  series: string
  color: string | null
  thickness: string
  wearLayer: string
  size: string | null
  padAttached: boolean
  features: string[]
  pricePerSqFt: number
  priceDisplay?: string
  sqFtPerCase: number
  planksPerCase: number | null
  pricePerCase: number
  note?: string
}

const products: Product[] = [
  {
    id: 1,
    image: '/plank1.png',
    name: 'Bayou Grey',
    sku: 'Bayou Gray LVP',
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
    name: 'Crest Oak',
    sku: '7"×60" Crest Oak Vinyl Flooring',
    series: 'Click LVP — Pad Attached',
    color: 'Crest Oak',
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
    image: '/plank3.png',
    name: 'English Oak',
    brand: 'Trucore',
    sku: 'Trucore 5×48 LVP',
    series: 'Trucore — Pad Attached',
    color: 'English Oak',
    thickness: '6mm',
    wearLayer: '20 mil',
    size: '5" × 48"',
    padAttached: true,
    features: ['100% Waterproof'],
    pricePerSqFt: 3.75,
    sqFtPerCase: 18.34,
    planksPerCase: null,
    pricePerCase: 68.78,
  },
  {
    id: 4,
    image: '/plank4.png',
    name: 'Rustic',
    sku: 'A-Z DE-0176',
    series: 'A-Z Click — Pad Attached',
    color: null,
    thickness: '5mm',
    wearLayer: '12 mil',
    size: null,
    padAttached: true,
    features: ['100% Waterproof'],
    pricePerSqFt: 2.79,
    sqFtPerCase: 21.29,
    planksPerCase: null,
    pricePerCase: 59.40,
  },
  {
    id: 5,
    image: '/plank5.png',
    name: 'Kool Grey',
    sku: 'A-Z fc1017-17',
    series: 'A-Z — Pad Attached',
    color: 'Kool Grey',
    thickness: '5mm',
    wearLayer: '12 mil',
    size: null,
    padAttached: true,
    features: ['100% Waterproof'],
    pricePerSqFt: 2.79,
    sqFtPerCase: 23.64,
    planksPerCase: null,
    pricePerCase: 65.95,
  },
  {
    id: 6,
    image: '/plank6.png',
    name: 'Amber',
    sku: 'A-Z P540',
    series: 'A-Z Click — Pad Attached',
    color: 'Amber',
    thickness: '4.5mm',
    wearLayer: '12 mil',
    size: null,
    padAttached: true,
    features: ['100% Waterproof'],
    pricePerSqFt: 2.79,
    sqFtPerCase: 31.11,
    planksPerCase: null,
    pricePerCase: 86.80,
  },
  {
    id: 7,
    image: '/plank7.png',
    name: 'Cinnamon',
    sku: 'A-Z SPC Cinnamon',
    series: 'A-Z SPC — Pad Attached',
    color: 'Cinnamon',
    thickness: '4.5mm',
    wearLayer: '12 mil',
    size: null,
    padAttached: true,
    features: ['100% Waterproof'],
    pricePerSqFt: 2.79,
    sqFtPerCase: 23.64,
    planksPerCase: null,
    pricePerCase: 65.95,
  },
  {
    id: 8,
    image: '/plank8.png',
    name: 'Portland Pine',
    brand: 'Dura Lux',
    sku: 'Dura Lux Portland Pine',
    series: 'Dura Lux Click — Pad Attached',
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
  {
    id: 9,
    image: '/plank9.png',
    name: 'Sterling Oak',
    sku: 'A-Z Rigid Core Sterling Oak',
    series: 'A-Z Rigid Core Click — Pad Attached',
    color: 'Sterling Oak',
    thickness: '5mm',
    wearLayer: '12 mil',
    size: null,
    padAttached: true,
    features: ['100% Waterproof'],
    pricePerSqFt: 2.79,
    sqFtPerCase: 21.29,
    planksPerCase: null,
    pricePerCase: 59.40,
  },
  {
    id: 10,
    image: '/plank10.png',
    name: 'Tan-Gray',
    sku: 'A-Z fc1016-10',
    series: 'A-Z — Pad Attached',
    color: 'Tan-Gray',
    thickness: '5mm',
    wearLayer: '12 mil',
    size: null,
    padAttached: true,
    features: ['100% Waterproof'],
    pricePerSqFt: 2.79,
    sqFtPerCase: 23.64,
    planksPerCase: null,
    pricePerCase: 65.95,
  },
  {
    id: 11,
    image: '/plank11.png',
    name: 'Bayou Breeze',
    brand: 'Dura Lux',
    sku: 'Dura Lux Bayou Breeze',
    series: 'Dura Lux Click — Pad Attached',
    color: 'Bayou Breeze',
    thickness: '5mm',
    wearLayer: '12 mil',
    size: '7" × 48"',
    padAttached: true,
    features: ['100% Waterproof'],
    pricePerSqFt: 2.79,
    sqFtPerCase: 25.52,
    planksPerCase: null,
    pricePerCase: 71.21,
  },
  {
    id: 12,
    image: '/plank12.png',
    name: 'Brown/Tan',
    sku: 'A-Z fc5107-17',
    series: 'A-Z Click — Pad Attached',
    color: 'Brown/Tan',
    thickness: '5mm',
    wearLayer: '12 mil',
    size: '7" × 48"',
    padAttached: true,
    features: ['100% Waterproof'],
    pricePerSqFt: 2.79,
    sqFtPerCase: 23.64,
    planksPerCase: null,
    pricePerCase: 65.95,
  },
  {
    id: 13,
    image: '/plank13.png',
    name: 'Dark Grey',
    sku: 'A-Z fc1026-22',
    series: 'A-Z Click — Pad Attached',
    color: 'Dark Grey',
    thickness: '5mm',
    wearLayer: '12 mil',
    size: null,
    padAttached: true,
    features: ['100% Waterproof'],
    pricePerSqFt: 2.79,
    sqFtPerCase: 23.64,
    planksPerCase: null,
    pricePerCase: 65.95,
  },
  {
    id: 14,
    image: '/plank14.png',
    name: 'Hillsboro Trace',
    brand: 'Dura Lux',
    sku: 'Dura Lux Hillsboro Trace',
    series: 'Dura Lux — Pad Attached',
    color: 'Hillsboro Trace',
    thickness: '5mm',
    wearLayer: '12 mil',
    size: '9" × 60"',
    padAttached: true,
    features: ['100% Waterproof'],
    pricePerSqFt: 2.79,
    sqFtPerCase: 26.78,
    planksPerCase: null,
    pricePerCase: 74.72,
  },
  {
    id: 15,
    image: '/plank15.png',
    name: 'Chiffon Lace Oak',
    sku: '9"×60" Chiffon Lace Oak',
    series: 'Click LVP — Pad Attached',
    color: 'Chiffon Lace',
    thickness: '7mm',
    wearLayer: '20 mil',
    size: '9" × 60"',
    padAttached: true,
    features: ['100% Waterproof'],
    pricePerSqFt: 4.50,
    sqFtPerCase: 30.89,
    planksPerCase: 8,
    pricePerCase: 138.94,
  },
  {
    id: 16,
    image: '/plank16.png',
    name: 'Discount Multi-Color Bundle',
    sku: 'Multi-SKU Bundle',
    series: '16 Colors Available — Pad Attached',
    color: null,
    thickness: '4.2mm–6.0mm',
    wearLayer: 'varies',
    size: '7" × 48"',
    padAttached: true,
    features: ['100% Waterproof'],
    pricePerSqFt: 1.83,
    priceDisplay: 'From $1.83/sq ft',
    sqFtPerCase: 0,
    planksPerCase: null,
    pricePerCase: 0,
    note: '16 colors available — pricing varies by color. Contact us for per-color pricing and availability.',
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
                  onError={e => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'256\' viewBox=\'0 0 400 256\'%3E%3Crect width=\'400\' height=\'256\' fill=\'%23f3f3f3\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' font-family=\'sans-serif\' font-size=\'14\' fill=\'%23aaa\'%3EImage Coming Soon%3C/text%3E%3C/svg%3E' }}
                />
                {product.padAttached && (
                  <span className="absolute top-3 left-3 bg-stronghold-black/80 text-stronghold-cream text-xs font-medium px-2.5 py-1 rounded-full">
                    Pad Attached
                  </span>
                )}
                <span className="absolute top-3 right-3 bg-stronghold-red text-white text-sm font-bold px-3 py-1.5 rounded-full">
                  {product.priceDisplay ?? `$${fmt(product.pricePerSqFt)}/sq ft`}
                </span>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1 gap-5">
                {/* Name & series */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs text-stronghold-gray uppercase tracking-wider">{product.series}</p>
                    {product.brand && (
                      <span className="text-xs bg-stronghold-lightgray text-stronghold-black font-semibold px-2 py-0.5 rounded">{product.brand}</span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-stronghold-black">{product.name}</h3>
                  <div className="flex flex-wrap gap-x-4 mt-0.5">
                    {product.color && (
                      <p className="text-sm text-stronghold-gray">Color: {product.color}</p>
                    )}
                    {product.sku && (
                      <p className="text-xs text-stronghold-gray font-mono">SKU: {product.sku}</p>
                    )}
                  </div>
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
                    {product.priceDisplay ? (
                      <>
                        <div className="text-xs text-stronghold-gray mb-1">Starting price</div>
                        <div className="text-2xl font-bold text-stronghold-black">{product.priceDisplay}</div>
                        <div className="text-sm text-stronghold-gray">Contact us for case pricing</div>
                      </>
                    ) : (
                      <>
                        <div className="text-xs text-stronghold-gray mb-1">Per case ({product.sqFtPerCase} sq ft)</div>
                        <div className="text-2xl font-bold text-stronghold-black">${fmt(product.pricePerCase)}</div>
                        <div className="text-sm text-stronghold-red font-medium">${fmt(product.pricePerSqFt)} per sq ft</div>
                      </>
                    )}
                  </div>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 bg-stronghold-red text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-stronghold-darkred transition-colors"
                  >
                    Order Now <ArrowRight size={15} />
                  </Link>
                </div>

                {product.note && (
                  <p className="text-xs text-stronghold-gray bg-stronghold-lightgray rounded-lg px-3 py-2">{product.note}</p>
                )}
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
