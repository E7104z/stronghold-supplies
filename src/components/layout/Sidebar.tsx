import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, Package, FileText,
  ShoppingCart, Receipt, TrendingUp, LogOut,
  FilePlus, MessageSquare, UserCog,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const adminNav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/contractors', label: 'Contractors', icon: Users },
  { to: '/admin/inventory', label: 'Inventory', icon: Package },
  { to: '/admin/quotes', label: 'Quotes', icon: FileText },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/invoices', label: 'Invoices', icon: Receipt },
  { to: '/admin/margins', label: 'Margins', icon: TrendingUp },
]

const contractorNav = [
  { to: '/portal', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/portal/request-quote', label: 'Request Quote', icon: FilePlus },
  { to: '/portal/quotes', label: 'My Quotes', icon: FileText },
  { to: '/portal/orders', label: 'My Orders', icon: ShoppingCart },
  { to: '/portal/invoices', label: 'Invoices', icon: Receipt },
  { to: '/portal/support', label: 'Support', icon: MessageSquare },
  { to: '/portal/account', label: 'Account', icon: UserCog },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const nav = user?.role === 'admin' ? adminNav : contractorNav

  return (
    <aside className="w-64 bg-stronghold-black flex flex-col h-screen fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="p-6 border-b border-stronghold-darkred">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Strong Hold Supplies" className="h-[120px] w-auto" />
        </div>
        <p className="text-stronghold-gray text-xs mt-2 uppercase tracking-widest">
          {user?.role === 'admin' ? 'Admin Portal' : 'Customer Portal'}
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-stronghold-red text-white'
                  : 'text-stronghold-gray hover:bg-stronghold-darkred hover:text-stronghold-cream'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-stronghold-darkred">
        <div className="text-stronghold-cream text-sm font-medium truncate">{user?.name}</div>
        <div className="text-stronghold-gray text-xs truncate mb-3">{user?.companyName}</div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-stronghold-gray hover:text-stronghold-red text-sm transition-colors w-full"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
