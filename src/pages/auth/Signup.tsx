import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function Signup() {
  const { signup } = useAuth()
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    companyName: '', phone: '',
    address: '', city: '', state: '', zip: '',
  })
  const [loading, setLoading] = useState(false)

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      await signup({
        name: form.name,
        email: form.email,
        password: form.password,
        companyName: form.companyName,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        zip: form.zip,
      })
      toast.success('Account created — welcome!')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create account'
      toast.error(msg.replace('Firebase: ', '').replace(/\(auth.*\)/, '').trim() || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stronghold-red'

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Link to="/">
            <img src="/logo.png" alt="Strong Hold Supplies" className="h-40 w-auto mx-auto mb-4" />
          </Link>
          <h1 className="text-stronghold-black text-2xl font-bold">Create your account</h1>
          <p className="text-stronghold-gray text-sm mt-1">Get wholesale pricing and access to our full catalog</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-xl">
          <h2 className="text-sm font-semibold text-stronghold-black uppercase tracking-wider mb-4">Your information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-stronghold-black mb-1">Full name *</label>
              <input required value={form.name} onChange={update('name')} className={inputCls} placeholder="Jane Smith" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stronghold-black mb-1">Phone *</label>
              <input required type="tel" value={form.phone} onChange={update('phone')} className={inputCls} placeholder="(555) 123-4567" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stronghold-black mb-1">Email *</label>
              <input required type="email" value={form.email} onChange={update('email')} className={inputCls} placeholder="you@example.com" autoComplete="email" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stronghold-black mb-1">Company name</label>
              <input value={form.companyName} onChange={update('companyName')} className={inputCls} placeholder="Optional — for businesses" />
            </div>
          </div>

          <h2 className="text-sm font-semibold text-stronghold-black uppercase tracking-wider mb-4">Shipping / project address</h2>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
            <div className="md:col-span-6">
              <label className="block text-sm font-medium text-stronghold-black mb-1">Street address</label>
              <input value={form.address} onChange={update('address')} className={inputCls} placeholder="123 Main St" />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-stronghold-black mb-1">City</label>
              <input value={form.city} onChange={update('city')} className={inputCls} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stronghold-black mb-1">State</label>
              <input value={form.state} onChange={update('state')} className={inputCls} maxLength={2} placeholder="TX" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stronghold-black mb-1">ZIP</label>
              <input value={form.zip} onChange={update('zip')} className={inputCls} maxLength={10} />
            </div>
          </div>

          <h2 className="text-sm font-semibold text-stronghold-black uppercase tracking-wider mb-4">Password</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-stronghold-black mb-1">Password *</label>
              <input required type="password" minLength={6} value={form.password} onChange={update('password')} className={inputCls} autoComplete="new-password" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stronghold-black mb-1">Confirm password *</label>
              <input required type="password" value={form.confirmPassword} onChange={update('confirmPassword')} className={inputCls} autoComplete="new-password" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stronghold-red text-white py-3 rounded-lg font-semibold hover:bg-stronghold-darkred transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>

          <p className="text-center text-stronghold-gray text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-stronghold-red font-medium hover:underline">Sign in</Link>
          </p>
        </form>

        <p className="text-center text-stronghold-gray text-xs mt-6">
          By signing up, you agree to receive transactional emails from Strong Hold Supplies.
        </p>
      </div>
    </div>
  )
}
