import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Zap, Mail, Lock, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Login() {
  const { user, signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/admin/dashboard" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) { toast.error('Please fill in all fields'); return }
    setLoading(true)
    try { await signIn(email, password); toast.success('Welcome back!') }
    catch (err) { toast.error(err.message || 'Invalid credentials') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-nexus-dark flex items-center justify-center p-4" style={{ fontFamily: "'Inter', system-ui, sans-serif", color: '#e5e5e5' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-nexus-red/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-nexus-orange/5 rounded-full blur-3xl" />
      </div>
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-nexus-red" />
            <span className="text-xl font-bold tracking-wider uppercase bg-gradient-to-r from-nexus-red to-nexus-orange bg-clip-text text-transparent">Nexus Admin</span>
          </div>
          <h1 className="text-2xl font-bold">Admin Console</h1>
          <p className="text-sm text-nexus-muted mt-2">Manage products, inventory, and categories</p>
        </div>
        <div className="bg-nexus-card border border-nexus-border rounded-xl p-6 md:p-8 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-nexus-muted mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nexus-muted" />
                <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@nexus.com" className="w-full bg-nexus-dark border border-nexus-border rounded-lg pl-10 pr-4 py-2.5 text-sm placeholder:text-nexus-muted/50 focus:border-nexus-red/50 transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-nexus-muted mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nexus-muted" />
                <input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full bg-nexus-dark border border-nexus-border rounded-lg pl-10 pr-4 py-2.5 text-sm placeholder:text-nexus-muted/50 focus:border-nexus-red/50 transition-colors" />
              </div>
            </div>
            <button id="login-submit" type="submit" disabled={loading} className="w-full bg-gradient-to-r from-nexus-red to-nexus-orange text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-nexus-muted/50 mt-6">Create your admin account in Supabase Dashboard → Authentication → Users</p>
      </div>
    </div>
  )
}
