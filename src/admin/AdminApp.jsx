import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import ProductForm from './pages/ProductForm'
import Inventory from './pages/Inventory'
import Categories from './pages/Categories'
import Migrate from './pages/Migrate'
import './admin.css'

function AdminRoutes() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-nexus-dark flex items-center justify-center" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-nexus-red border-t-transparent rounded-full animate-spin" />
          <p className="text-nexus-muted text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="products/add" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="categories" element={<Categories />} />
            <Route path="migrate" element={<Migrate />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#111111', color: '#e5e5e5', border: '1px solid #222222' },
          success: { iconTheme: { primary: '#22c55e', secondary: '#111111' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#111111' } },
        }}
      />
    </>
  )
}

export default function AdminApp() {
  return (
    <AuthProvider>
      <AdminRoutes />
    </AuthProvider>
  )
}
