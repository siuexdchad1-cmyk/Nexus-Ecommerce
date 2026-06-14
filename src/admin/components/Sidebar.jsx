import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, Warehouse, FolderTree, DatabaseBackup, X, Zap } from 'lucide-react'

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/inventory', icon: Warehouse, label: 'Inventory' },
  { to: '/admin/categories', icon: FolderTree, label: 'Categories' },
  { to: '/admin/migrate', icon: DatabaseBackup, label: 'Migrate Data' },
]

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-nexus-card border-r border-nexus-border flex flex-col transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 h-16 border-b border-nexus-border">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-nexus-red" />
            <span className="text-lg font-bold tracking-tight">
              <span className="text-nexus-red">NEXUS</span>
              <span className="text-nexus-muted ml-1 text-sm font-normal">ADMIN</span>
            </span>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 rounded-md hover:bg-nexus-border transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={onClose}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? 'bg-nexus-red/10 text-nexus-red border border-nexus-red/20' : 'text-nexus-muted hover:text-nexus-text hover:bg-nexus-border/50'}`}>
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-3 border-t border-nexus-border">
          <NavLink to="/" onClick={onClose} className="text-xs text-nexus-muted hover:text-nexus-red transition-colors block text-center">← Back to Store</NavLink>
        </div>
      </aside>
    </>
  )
}