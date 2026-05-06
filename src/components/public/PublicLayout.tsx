import { Outlet } from 'react-router-dom'
import PublicNav from './PublicNav'
import { Toaster } from 'react-hot-toast'

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PublicNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-stronghold-black border-t border-stronghold-darkred py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Strong Hold Supplies" className="h-24 w-auto" />
          </div>
          <p className="text-stronghold-gray text-sm">
            © {new Date().getFullYear()} Strong Hold Supplies. All rights reserved.
          </p>
        </div>
      </footer>
      <Toaster position="top-right" toastOptions={{ style: { background: '#1A1A1A', color: '#E8E4DC', border: '1px solid #8B1A1A' } }} />
    </div>
  )
}
