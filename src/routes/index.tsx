import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Login from '../pages/auth/Login'
import Layout from '../components/layout/Layout'
import PublicLayout from '../components/public/PublicLayout'

import Dashboard from '../pages/admin/Dashboard'
import Contractors from '../pages/admin/Contractors'
import Inventory from '../pages/admin/Inventory'
import Quotes from '../pages/admin/Quotes'
import Orders from '../pages/admin/Orders'
import Invoices from '../pages/admin/Invoices'
import MarginTracker from '../pages/admin/MarginTracker'

import ContractorDashboard from '../pages/contractor/ContractorDashboard'
import ContractorQuotes from '../pages/contractor/ContractorQuotes'
import ContractorOrders from '../pages/contractor/ContractorOrders'

import Home from '../pages/public/Home'
import Products from '../pages/public/Products'
import Contact from '../pages/public/Contact'
import FAQ from '../pages/public/FAQ'

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen bg-stronghold-black">
      <div className="text-center">
        <img src="/logo.png" alt="Strong Hold Supplies" className="h-36 w-auto mx-auto mb-4 opacity-80" />
        <div className="text-stronghold-cream text-sm tracking-widest uppercase">Loading...</div>
      </div>
    </div>
  )
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />
  return <>{children}</>
}

function ContractorRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user || user.role !== 'contractor') return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) return <LoadingScreen />

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
        </Route>

        <Route path="/login" element={
          user ? <Navigate to={user.role === 'admin' ? '/admin' : '/portal'} replace /> : <Login />
        } />

        <Route path="/admin" element={<AdminRoute><Layout /></AdminRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="contractors" element={<Contractors />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="quotes" element={<Quotes />} />
          <Route path="orders" element={<Orders />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="margins" element={<MarginTracker />} />
        </Route>

        <Route path="/portal" element={<ContractorRoute><Layout /></ContractorRoute>}>
          <Route index element={<ContractorDashboard />} />
          <Route path="quotes" element={<ContractorQuotes />} />
          <Route path="orders" element={<ContractorOrders />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
