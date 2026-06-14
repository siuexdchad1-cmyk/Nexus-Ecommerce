import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ImagePreview from '../components/ImagePreview'
import ConfirmModal from '../components/ConfirmModal'
import { Plus, Search, Pencil, Trash2, Package } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Products() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  async function fetchProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .order('created_at', { ascending: false })
    if (error) {
      toast.error('Failed to fetch products')
    } else {
      setProducts(data || [])
    }
    setLoading(false)
  }

  async function fetchCategories() {
    const { data } = await supabase.from('categories').select('id, name').order('name')
    setCategories(data || [])
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    const { error } = await supabase.from('products').delete().eq('id', deleteTarget.id)
    if (error) {
      toast.error('Failed to delete product')
    } else {
      toast.success(`"${deleteTarget.name}" deleted`)
      setProducts(prev => prev.filter(p => p.id !== deleteTarget.id))
    }
    setDeleting(false)
    setDeleteTarget(null)
  }

  const filtered = products.filter(p => {
    const q = search.toLowerCase()
    return (
      p.name?.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-nexus-muted text-sm mt-1">{products.length} total products</p>
        </div>
        <Link
          to="/admin/products/add"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-nexus-red to-nexus-orange text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md flex items-center bg-nexus-card/40 border border-nexus-border/80 rounded-xl px-3.5 py-2 group focus-within:border-nexus-red/40 focus-within:ring-1 focus-within:ring-nexus-red/10 transition-all duration-200">
        <Search className="w-4 h-4 text-nexus-muted group-focus-within:text-nexus-red transition-colors duration-200 flex-shrink-0 mr-2.5" />
        <input
          id="product-search"
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, SKU, or brand..."
          className="w-full bg-transparent border-none text-sm text-nexus-text placeholder:text-nexus-muted/40 outline-none focus:ring-0 p-0"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-3 border-nexus-red border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-nexus-card border border-nexus-border rounded-xl p-12 text-center">
          <Package className="w-12 h-12 text-nexus-muted mx-auto mb-3" />
          <p className="text-nexus-muted">{search ? 'No products match your search' : 'No products yet'}</p>
          {!search && (
            <Link to="/admin/products/add" className="text-nexus-red text-sm mt-2 inline-block hover:underline">Add your first product →</Link>
          )}
        </div>
      ) : (
        <div className="bg-nexus-card border border-nexus-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-nexus-border">
                  <th className="text-left p-4 text-nexus-muted font-medium">Product</th>
                  <th className="text-left p-4 text-nexus-muted font-medium hidden md:table-cell">SKU</th>
                  <th className="text-left p-4 text-nexus-muted font-medium hidden lg:table-cell">Category</th>
                  <th className="text-left p-4 text-nexus-muted font-medium">Price</th>
                  <th className="text-left p-4 text-nexus-muted font-medium hidden sm:table-cell">Stock</th>
                  <th className="text-left p-4 text-nexus-muted font-medium">Status</th>
                  <th className="text-right p-4 text-nexus-muted font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(product => (
                  <tr key={product.id} className="border-b border-nexus-border/50 hover:bg-nexus-card-hover transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <ImagePreview url={product.image_url} size="sm" />
                        <div className="min-w-0">
                          <p className="font-medium truncate max-w-[200px]">{product.name}</p>
                          <p className="text-xs text-nexus-muted">{product.brand || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-nexus-muted hidden md:table-cell">{product.sku || '-'}</td>
                    <td className="p-4 text-nexus-muted hidden lg:table-cell">{product.categories?.name || '-'}</td>
                    <td className="p-4">
                      <span className="font-semibold">${Number(product.price).toFixed(2)}</span>
                      {product.discount_price && (
                        <span className="text-xs text-nexus-success ml-1.5">${Number(product.discount_price).toFixed(2)}</span>
                      )}
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className={`font-semibold ${product.stock_quantity < 10 ? 'text-nexus-warning' : 'text-nexus-text'}`}>
                        {product.stock_quantity}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        product.status === 'active'
                          ? 'bg-nexus-success/10 text-nexus-success'
                          : 'bg-nexus-danger/10 text-nexus-danger'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => navigate(`/products/edit/${product.id}`)}
                          className="p-2 rounded-lg hover:bg-nexus-border/50 text-nexus-muted hover:text-nexus-text transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(product)}
                          className="p-2 rounded-lg hover:bg-nexus-danger/10 text-nexus-muted hover:text-nexus-danger transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        isLoading={deleting}
      />
    </div>
  )
}
