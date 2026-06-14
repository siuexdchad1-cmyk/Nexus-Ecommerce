import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import StatsCard from '../components/StatsCard'
import { Package, PackageCheck, AlertTriangle, FolderTree, ExternalLink } from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, active: 0, lowStock: 0, categories: 0 })
  const [lowStockProducts, setLowStockProducts] = useState([])
  const [recentProducts, setRecentProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchDashboardData() }, [])

  async function fetchDashboardData() {
    try {
      const { data: products } = await supabase.from('products').select('id, name, sku, stock_quantity, status, image_url, created_at').order('created_at', { ascending: false })
      const { count: catCount } = await supabase.from('categories').select('*', { count: 'exact', head: true })
      const all = products || []
      const active = all.filter(p => p.status === 'active')
      const low = all.filter(p => p.stock_quantity < 10)
      setStats({ total: all.length, active: active.length, lowStock: low.length, categories: catCount || 0 })
      setLowStockProducts(low.slice(0, 5))
      setRecentProducts(all.slice(0, 5))
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-3 border-nexus-red border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Dashboard</h1><p className="text-nexus-muted text-sm mt-1">Overview of your store</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={Package} label="Total Products" value={stats.total} />
        <StatsCard icon={PackageCheck} label="Active Products" value={stats.active} color="text-nexus-success" bgColor="bg-nexus-success/10" />
        <StatsCard icon={AlertTriangle} label="Low Stock Alerts" value={stats.lowStock} color="text-nexus-warning" bgColor="bg-nexus-warning/10" />
        <StatsCard icon={FolderTree} label="Categories" value={stats.categories} color="text-nexus-orange" bgColor="bg-nexus-orange/10" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-nexus-card border border-nexus-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold">Recent Products</h2><Link to="/admin/products" className="text-xs text-nexus-red hover:text-nexus-orange transition-colors flex items-center gap-1">View All <ExternalLink className="w-3 h-3" /></Link></div>
          {recentProducts.length === 0 ? <p className="text-sm text-nexus-muted py-8 text-center">No products yet. Run a migration!</p> : (
            <div className="space-y-3">{recentProducts.map(p => (
              <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-nexus-border/30 transition-colors">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-nexus-border/50 flex-shrink-0">{p.image_url ? <img src={p.image_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Package className="w-4 h-4 text-nexus-muted" /></div>}</div>
                <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{p.name}</p><p className="text-xs text-nexus-muted">{p.sku || 'No SKU'}</p></div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === 'active' ? 'bg-nexus-success/10 text-nexus-success' : 'bg-nexus-danger/10 text-nexus-danger'}`}>{p.status}</span>
              </div>
            ))}</div>
          )}
        </div>
        <div className="bg-nexus-card border border-nexus-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold">Low Stock Alerts</h2><Link to="/admin/inventory" className="text-xs text-nexus-red hover:text-nexus-orange transition-colors flex items-center gap-1">Manage <ExternalLink className="w-3 h-3" /></Link></div>
          {lowStockProducts.length === 0 ? <p className="text-sm text-nexus-muted py-8 text-center">All products are well-stocked! 🎉</p> : (
            <div className="space-y-3">{lowStockProducts.map(p => (
              <div key={p.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-nexus-border/30 transition-colors">
                <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{p.name}</p><p className="text-xs text-nexus-muted">{p.sku || 'No SKU'}</p></div>
                <span className={`text-sm font-bold px-2.5 py-1 rounded-lg ${p.stock_quantity === 0 ? 'bg-nexus-danger/10 text-nexus-danger' : p.stock_quantity < 5 ? 'bg-nexus-warning/10 text-nexus-warning' : 'bg-nexus-orange/10 text-nexus-orange'}`}>{p.stock_quantity} left</span>
              </div>
            ))}</div>
          )}
        </div>
      </div>
    </div>
  )
}
