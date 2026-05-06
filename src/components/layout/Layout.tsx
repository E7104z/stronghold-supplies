import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { Toaster } from 'react-hot-toast'

export default function Layout() {
  return (
    <div className="flex bg-stronghold-lightgray min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 p-8 overflow-y-auto min-h-screen">
        <Outlet />
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1A1A1A',
            color: '#E8E4DC',
            border: '1px solid #8B1A1A'
          }
        }}
      />
    </div>
  )
}
