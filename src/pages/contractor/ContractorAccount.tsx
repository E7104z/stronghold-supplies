import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { User, Lock, MapPin, Mail, Phone, Building } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContractorAccount() {
  const { user, updateProfile, changePassword } = useAuth()
  const [form, setForm] = useState({
    name: '', companyName: '', phone: '',
    address: '', city: '', state: '', zip: '',
  })
  const [pw, setPw] = useState({ next: '', confirm: '' })
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPw, setSavingPw] = useState(false)

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? '',
        companyName: user.companyName ?? '',
        phone: user.phone ?? '',
        address: user.address ?? '',
        city: user.city ?? '',
        state: user.state ?? '',
        zip: user.zip ?? '',
      })
    }
  }, [user])

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault()
    setSavingProfile(true)
    try {
      await updateProfile(form)
      toast.success('Profile updated')
    } catch {
      toast.error('Could not save profile')
    } finally {
      setSavingProfile(false)
    }
  }

  const savePw = async (e: FormEvent) => {
    e.preventDefault()
    if (pw.next.length < 6) return toast.error('Password must be at least 6 characters')
    if (pw.next !== pw.confirm) return toast.error('Passwords do not match')
    setSavingPw(true)
    try {
      await changePassword(pw.next)
      setPw({ next: '', confirm: '' })
      toast.success('Password changed')
    } catch {
      toast.error('Could not change password — sign out and back in, then try again')
    } finally {
      setSavingPw(false)
    }
  }

  const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stronghold-red'

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stronghold-black">Account Settings</h1>
        <p className="text-stronghold-gray text-sm">Manage your profile and security</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account summary card */}
        <Card className="p-6 lg:col-span-1 h-fit">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="w-16 h-16 rounded-full bg-stronghold-red text-white flex items-center justify-center text-2xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-stronghold-black truncate">{user?.name}</div>
              <div className="text-xs text-stronghold-gray truncate">{user?.companyName || '—'}</div>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-stronghold-gray"><Mail size={14} /> {user?.email}</div>
            <div className="flex items-center gap-2 text-stronghold-gray"><Phone size={14} /> {user?.phone || '—'}</div>
            <div className="flex items-center gap-2 text-stronghold-gray"><Building size={14} /> {user?.companyName || '—'}</div>
            <div className="flex items-start gap-2 text-stronghold-gray">
              <MapPin size={14} className="mt-0.5 shrink-0" />
              <span>
                {user?.address}
                {user?.city || user?.state || user?.zip ? <><br />{[user.city, user.state, user.zip].filter(Boolean).join(', ')}</> : null}
                {!user?.address && !user?.city && '—'}
              </span>
            </div>
          </div>
        </Card>

        {/* Profile form */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <User size={18} className="text-stronghold-red" />
            <h2 className="font-semibold text-stronghold-black">Profile</h2>
          </div>

          <form onSubmit={saveProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stronghold-gray uppercase tracking-wider mb-1">Full name</label>
                <input value={form.name} onChange={update('name')} className={inputCls} required />
              </div>
              <div>
                <label className="block text-xs font-medium text-stronghold-gray uppercase tracking-wider mb-1">Phone</label>
                <input value={form.phone} onChange={update('phone')} className={inputCls} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-stronghold-gray uppercase tracking-wider mb-1">Company name</label>
                <input value={form.companyName} onChange={update('companyName')} className={inputCls} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-stronghold-gray uppercase tracking-wider mb-1">Street address</label>
                <input value={form.address} onChange={update('address')} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-medium text-stronghold-gray uppercase tracking-wider mb-1">City</label>
                <input value={form.city} onChange={update('city')} className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stronghold-gray uppercase tracking-wider mb-1">State</label>
                  <input value={form.state} onChange={update('state')} className={inputCls} maxLength={2} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stronghold-gray uppercase tracking-wider mb-1">ZIP</label>
                  <input value={form.zip} onChange={update('zip')} className={inputCls} />
                </div>
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <Button type="submit" disabled={savingProfile}>
                {savingProfile ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Password form */}
        <Card className="p-6 lg:col-span-3">
          <div className="flex items-center gap-2 mb-4">
            <Lock size={18} className="text-stronghold-red" />
            <h2 className="font-semibold text-stronghold-black">Change Password</h2>
          </div>

          <form onSubmit={savePw} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-medium text-stronghold-gray uppercase tracking-wider mb-1">New password</label>
              <input type="password" value={pw.next} onChange={e => setPw(p => ({ ...p, next: e.target.value }))} className={inputCls} minLength={6} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-stronghold-gray uppercase tracking-wider mb-1">Confirm new password</label>
              <input type="password" value={pw.confirm} onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))} className={inputCls} minLength={6} required />
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="secondary" disabled={savingPw}>
                {savingPw ? 'Updating...' : 'Update password'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
