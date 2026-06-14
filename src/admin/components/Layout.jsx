import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Sidebar from './Sidebar'
import { Menu, LogOut, User } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try { await signOut(); toast.success('Signed out') } catch { toast.error('Failed to sign out') }
  }

  return (
    <div className="admin-panel min-h-screen bg-nexus-dark" style={{ fontFamily: "'Inter', system-ui, sans-serif", color: '#e5e5e5' }}>
      {/* Subtle animated gradient background */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-20%', left: '-10%', width: '50%', height: '50%',
          background: 'radial-gradient(circle, rgba(255,60,60,0.06) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(80px)',
          animation: 'adminFloat1 20s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', right: '-10%', width: '50%', height: '50%',
          background: 'radial-gradient(circle, rgba(255,107,0,0.05) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(80px)',
          animation: 'adminFloat2 25s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute', top: '40%', left: '50%', width: '40%', height: '40%',
          background: 'radial-gradient(circle, rgba(255,60,60,0.03) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(60px)',
          animation: 'adminFloat3 18s ease-in-out infinite'
        }} />
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-64 min-h-screen flex flex-col" style={{ position: 'relative', zIndex: 1 }}>
        <header className="sticky top-0 z-30 h-16 bg-nexus-card/80 backdrop-blur-xl border-b border-nexus-border flex items-center justify-between px-4 lg:px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-nexus-border transition-colors"><Menu className="w-5 h-5" /></button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-nexus-border/50">
              <User className="w-4 h-4 text-nexus-muted" />
              <span className="text-sm">{user?.email || 'Admin'}</span>
            </div>
            <button onClick={handleSignOut} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-nexus-muted hover:text-nexus-red hover:bg-nexus-red/10 transition-all">
              <LogOut className="w-4 h-4" /><span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6"><Outlet /></main>
      </div>
    </div>
  )
}