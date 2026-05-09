import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/products', label: 'Products' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
]

export default function PublicNav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-[168px] flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Strong Hold Supplies" className="h-[120px] w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-stronghold-red'
                    : 'text-stronghold-black hover:text-stronghold-red'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Login CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="text-stronghold-black hover:text-stronghold-red text-sm font-medium transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="bg-stronghold-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-stronghold-darkred transition-colors"
          >
            Create Account
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-stronghold-black hover:text-stronghold-red"
          onClick={() => setOpen(o => !o)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white px-6 pb-4 space-y-1">
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'text-stronghold-red' : 'text-stronghold-black hover:text-stronghold-red'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="block mt-2 px-4 py-2.5 rounded-lg text-sm font-medium text-center text-stronghold-black hover:text-stronghold-red transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            onClick={() => setOpen(false)}
            className="block bg-stronghold-red text-white px-4 py-2.5 rounded-lg text-sm font-medium text-center hover:bg-stronghold-darkred transition-colors"
          >
            Create Account
          </Link>
        </div>
      )}
    </header>
  )
}
