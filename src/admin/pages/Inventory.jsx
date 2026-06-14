import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Warehouse, Search, Save, X, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Inventory() {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [newQty, setNewQty] = useState('')
  const [reason, setReason] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, sku, brand, stock_quantity, status, image_url')
      .order('stock_quantity', { ascending: true })
    if (error) {
      toast.error('Failed to fetch inventory')
    } else {
      setProducts(data || [])
    }
    setLoading(false)
  }

  async function handleUpdateStock(product) {
    if (newQty === '' || Number(newQty) < 0) {
      toast.error('Enter a valid quantity')
      return
    }

    setSaving(true)
    const oldQty = product.stock_quantity
    const qty = Number(newQty)

    try {
      // Update product stock
      const { error: updateErr } = await supabase
        .from('products')
        .update({ stock_quantity: qty })
        .eq('id', product.id)
      if (updateErr) throw updateErr

      // Log to stock_history
      const { error: histErr } = await supabase.from('stock_history').insert({
        product_id: product.id,
        changed_by: user?.email || 'admin',
        old_quantity: oldQty,
        new_quantity: qty,
        reason: reason.trim() || 'Manual update',
      })
      if (histErr) console.error('Stock history error:', histErr)

      toast.success(`Stock updated: ${oldQty} → ${qty}`)
      setEditingId(null)
      setNewQty('')
      setReason('')
      fetchProducts()
    } catch (err) {
      toast.error('Failed to update stock')
    } finally {
      setSaving(false)
    }
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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
        <p className="text-nexus-muted text-sm mt-1">Manage stock levels for all products</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md flex items-center bg-nexus-card/40 border border-nexus-border/80 rounded-xl px-3.5 py-2 group focus-within:border-nexus-red/40 focus-within:ring-1 focus-within:ring-nexus-red/10 transition-all duration-200">
        <Search className="w-4 h-4 text-nexus-muted group-focus-within:text-nexus-red transition-colors duration-200 flex-shrink-0 mr-2.5" />
        <input
          id="inventory-search"
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
          <Warehouse className="w-12 h-12 text-nexus-muted mx-auto mb-3" />
          <p className="text-nexus-muted">{search ? 'No matching products' : 'No products in inventory'}</p>
        </div>
      ) : (
        <div className="bg-nexus-card border border-nexus-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-nexus-border">
                  <th className="text-left p-4 text-nexus-muted font-medium">Product</th>
                  <th className="text-left p-4 text-nexus-muted font-medium hidden md:table-cell">SKU</th>
                  <th className="text-left p-4 text-nexus-muted font-medium">Stock</th>
                  <th className="text-left p-4 text-nexus-muted font-medium hidden sm:table-cell">Status</th>
                  <th className="text-right p-4 text-nexus-muted font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(product => {
                  const isLow = product.stock_quantity < 10
                  const isOut = product.stock_quantity === 0
                  const isEditing = editingId === product.id

                  return (
                    <tr
                      key={product.id}
                      className={`border-b border-nexus-border/50 transition-colors ${
                        isOut
                          ? 'bg-nexus-danger/5'
                          : isLow
                          ? 'bg-nexus-warning/5'
                          : 'hover:bg-nexus-card-hover'
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg overflow-hidden bg-nexus-border/50 flex-shrink-0">
                            {product.image_url ? (
                              <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Warehouse className="w-4 h-4 text-nexus-muted" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate max-w-[200px]">{product.name}</p>
                            <p className="text-xs text-nexus-muted">{product.brand || '-'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-nexus-muted hidden md:table-cell">{product.sku || '-'}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {isLow && <AlertTriangle className="w-3.5 h-3.5 text-nexus-warning flex-shrink-0" />}
                          <span
                            className={`font-bold ${
                              isOut
                                ? 'text-nexus-danger'
                                : isLow
                                ? 'text-nexus-warning'
                                : 'text-nexus-text'
                            }`}
                          >
                            {product.stock_quantity}
                          </span>
                          {isOut && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-nexus-danger/10 text-nexus-danger font-medium">
                              OUT
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            product.status === 'active'
                              ? 'bg-nexus-success/10 text-nexus-success'
                              : 'bg-nexus-danger/10 text-nexus-danger'
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end">
                          {isEditing ? (
                            <div className="flex items-center gap-2 flex-wrap justify-end">
                              <input
                                type="number"
                                min="0"
                                value={newQty}
                                onChange={e => setNewQty(e.target.value)}
                                placeholder="Qty"
                                className="w-20 bg-nexus-dark border border-nexus-border rounded px-2 py-1.5 text-sm focus:border-nexus-red/50"
                                autoFocus
                              />
                              <input
                                type="text"
                                value={reason}
                                onChange={e => setReason(e.target.value)}
                                placeholder="Reason"
                                className="w-28 bg-nexus-dark border border-nexus-border rounded px-2 py-1.5 text-sm focus:border-nexus-red/50 hidden sm:block"
                              />
                              <button
                                onClick={() => handleUpdateStock(product)}
                                disabled={saving}
                                className="p-1.5 rounded-lg bg-nexus-success/10 text-nexus-success hover:bg-nexus-success/20 transition-colors disabled:opacity-50"
                                title="Save"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingId(null)
                                  setNewQty('')
                                  setReason('')
                                }}
                                className="p-1.5 rounded-lg hover:bg-nexus-border/50 text-nexus-muted transition-colors"
                                title="Cancel"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                  setEditingId(product.id)
                                  setNewQty(String(product.stock_quantity))
                                  setReason('')
                              }}
                              className="text-xs px-3 py-1.5 rounded-lg bg-nexus-border/50 hover:bg-nexus-border text-nexus-text transition-colors"
                            >
                              Update Stock
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}