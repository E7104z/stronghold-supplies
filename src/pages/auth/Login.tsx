import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const { login, resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
    } catch {
      toast.error('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const handleForgot = async () => {
    if (!email) {
      toast.error('Enter your email above first')
      return
    }
    try {
      await resetPassword(email)
      toast.success('Password reset email sent')
    } catch {
      toast.error('Could not send reset email')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/">
            <img src="/logo.png" alt="Strong Hold Supplies" className="h-60 w-auto mx-auto mb-4" />
          </Link>
          <h1 className="text-stronghold-black text-2xl font-bold">Welcome back</h1>
          <p className="text-stronghold-gray text-sm mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-xl">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stronghold-black mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stronghold-red"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-stronghold-black">Password</label>
                <button type="button" onClick={handleForgot} className="text-xs text-stronghold-red hover:underline">Forgot?</button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stronghold-red"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-stronghold-red text-white py-2.5 rounded-lg font-medium hover:bg-stronghold-darkred transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-stronghold-gray text-sm mt-6">
            New customer?{' '}
            <Link to="/signup" className="text-stronghold-red font-medium hover:underline">Create an account</Link>
          </p>
        </form>

        <p className="text-center text-stronghold-gray text-xs mt-6">
          Strong Hold Supplies — Wholesale Pricing
        </p>
      </div>
    </div>
  )
}
