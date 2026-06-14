import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ImagePreview from '../components/ImagePreview'
import { Save, ArrowLeft, Plus, Trash2, Image } from 'lucide-react'
import toast from 'react-hot-toast'

const emptyVariant = { color: '', storage: '', ram: '', price: '', stock_quantity: 0 }

export default function ProductForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEditing)
  const [categories, setCategories] = useState([])

  const [form, setForm] = useState({
    name: '',
    serial_number: '',
    sku: '',
    brand: '',
    description: '',
    category_id: '',
    price: '',
    discount_price: '',
    stock_quantity: 0,
    image_url: '',
    image_urls: [],
    status: 'active',
  })

  const [variants, setVariants] = useState([])
  const [newImageUrl, setNewImageUrl] = useState('')

  useEffect(() => {
    fetchCategories()
    if (isEditing) fetchProduct()
  }, [id])

  async function fetchCategories() {
    const { data } = await supabase.from('categories').select('id, name').order('name')
    setCategories(data || [])
  }

  async function fetchProduct() {
    setFetching(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      toast.error('Product not found')
      navigate('/admin/products')
      return
    }

    setForm({
      name: data.name || '',
      serial_number: data.serial_number || '',
      sku: data.sku || '',
      brand: data.brand || '',
      description: data.description || '',
      category_id: data.category_id || '',
      price: data.price || '',
      discount_price: data.discount_price || '',
      stock_quantity: data.stock_quantity || 0,
      image_url: data.image_url || '',
      image_urls: data.image_urls || [],
      status: data.status || 'active',
    })

    // Fetch variants
    const { data: variantData } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', id)
    setVariants(variantData || [])
    setFetching(false)
  }

  function updateForm(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function addImageUrl() {
    if (!newImageUrl.trim()) return
    if (!newImageUrl.startsWith('http://') && !newImageUrl.startsWith('https://')) {
      toast.error('URL must start with http:// or https://')
      return
    }
    setForm(prev => ({ ...prev, image_urls: [...prev.image_urls, newImageUrl.trim()] }))
    setNewImageUrl('')
  }

  function removeImageUrl(index) {
    setForm(prev => ({
      ...prev,
      image_urls: prev.image_urls.filter((_, i) => i !== index),
    }))
  }

  function addVariant() {
    setVariants(prev => [...prev, { ...emptyVariant }])
  }

  function updateVariant(index, key, value) {
    setVariants(prev => prev.map((v, i) => (i === index ? { ...v, [key]: value } : v)))
  }

  function removeVariant(index) {
    setVariants(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!form.name.trim()) {
      toast.error('Product name is required')
      return
    }
    if (!form.price || Number(form.price) <= 0) {
      toast.error('Price must be greater than 0')
      return
    }
    if (form.image_url && !form.image_url.startsWith('http://') && !form.image_url.startsWith('https://')) {
      toast.error('Image URL must start with http:// or https://')
      return
    }

    setLoading(true)
    const productData = {
      name: form.name.trim(),
      serial_number: form.serial_number.trim() || null,
      sku: form.sku.trim() || null,
      brand: form.brand.trim() || null,
      description: form.description.trim() || null,
      category_id: form.category_id || null,
      price: Number(form.price),
      discount_price: form.discount_price ? Number(form.discount_price) : null,
      stock_quantity: Number(form.stock_quantity) || 0,
      image_url: form.image_url.trim() || null,
      image_urls: form.image_urls.length > 0 ? form.image_urls : [],
      status: form.status,
    }

    try {
      if (isEditing) {
        const { error } = await supabase.from('products').update(productData).eq('id', id)
        if (error) throw error

        // Handle variants: delete existing and re-insert
        await supabase.from('product_variants').delete().eq('product_id', id)
        if (variants.length > 0) {
          const variantRows = variants
            .filter(v => v.color || v.storage || v.ram)
            .map(v => ({
              product_id: id,
              color: v.color || null,
              storage: v.storage || null,
              ram: v.ram || null,
              price: v.price ? Number(v.price) : null,
              stock_quantity: Number(v.stock_quantity) || 0,
            }))
          if (variantRows.length > 0) {
            const { error: vErr } = await supabase.from('product_variants').insert(variantRows)
            if (vErr) console.error('Variant insert error:', vErr)
          }
        }

        toast.success('Product updated!')
      } else {
        const { data: inserted, error } = await supabase
          .from('products')
          .insert(productData)
          .select('id')
          .single()
        if (error) throw error

        // Insert variants
        if (variants.length > 0 && inserted) {
          const variantRows = variants
            .filter(v => v.color || v.storage || v.ram)
            .map(v => ({
              product_id: inserted.id,
              color: v.color || null,
              storage: v.storage || null,
              ram: v.ram || null,
              price: v.price ? Number(v.price) : null,
              stock_quantity: Number(v.stock_quantity) || 0,
            }))
          if (variantRows.length > 0) {
            await supabase.from('product_variants').insert(variantRows)
          }
        }

        toast.success('Product created!')
      }
      navigate('/admin/products')
    } catch (err) {
      toast.error(err.message || 'Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-nexus-red border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/products')}
          className="p-2 rounded-lg hover:bg-nexus-border/50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEditing ? 'Edit Product' : 'Add Product'}
          </h1>
          <p className="text-nexus-muted text-sm mt-1">
            {isEditing ? 'Update product information' : 'Fill in the product details'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-nexus-card border border-nexus-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm text-nexus-muted mb-1.5">Product Name *</label>
              <input
                id="product-name"
                type="text"
                value={form.name}
                onChange={e => updateForm('name', e.target.value)}
                placeholder="e.g. iPhone 15 Pro Max"
                className="w-full bg-nexus-dark border border-nexus-border rounded-lg px-4 py-2.5 text-sm focus:border-nexus-red/50 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-nexus-muted mb-1.5">Serial Number</label>
              <input
                type="text"
                value={form.serial_number}
                onChange={e => updateForm('serial_number', e.target.value)}
                placeholder="e.g. NX-001"
                className="w-full bg-nexus-dark border border-nexus-border rounded-lg px-4 py-2.5 text-sm focus:border-nexus-red/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-nexus-muted mb-1.5">SKU</label>
              <input
                type="text"
                value={form.sku}
                onChange={e => updateForm('sku', e.target.value)}
                placeholder="e.g. NEXUS-PHONE-001"
                className="w-full bg-nexus-dark border border-nexus-border rounded-lg px-4 py-2.5 text-sm focus:border-nexus-red/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-nexus-muted mb-1.5">Brand</label>
              <input
                type="text"
                value={form.brand}
                onChange={e => updateForm('brand', e.target.value)}
                placeholder="e.g. Apple"
                className="w-full bg-nexus-dark border border-nexus-border rounded-lg px-4 py-2.5 text-sm focus:border-nexus-red/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-nexus-muted mb-1.5">Category</label>
              <select
                id="product-category"
                value={form.category_id}
                onChange={e => updateForm('category_id', e.target.value)}
                className="w-full bg-nexus-dark border border-nexus-border rounded-lg px-4 py-2.5 text-sm focus:border-nexus-red/50 transition-colors"
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-nexus-muted mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={e => updateForm('description', e.target.value)}
                placeholder="Product description..."
                rows={3}
                className="w-full bg-nexus-dark border border-nexus-border rounded-lg px-4 py-2.5 text-sm focus:border-nexus-red/50 transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-nexus-card border border-nexus-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Pricing & Stock</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-nexus-muted mb-1.5">Price ($) *</label>
              <input
                id="product-price"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={e => updateForm('price', e.target.value)}
                placeholder="0.00"
                className="w-full bg-nexus-dark border border-nexus-border rounded-lg px-4 py-2.5 text-sm focus:border-nexus-red/50 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-nexus-muted mb-1.5">Discount Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.discount_price}
                onChange={e => updateForm('discount_price', e.target.value)}
                placeholder="0.00"
                className="w-full bg-nexus-dark border border-nexus-border rounded-lg px-4 py-2.5 text-sm focus:border-nexus-red/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-nexus-muted mb-1.5">Stock Quantity</label>
              <input
                id="product-stock"
                type="number"
                min="0"
                value={form.stock_quantity}
                onChange={e => updateForm('stock_quantity', e.target.value)}
                className="w-full bg-nexus-dark border border-nexus-border rounded-lg px-4 py-2.5 text-sm focus:border-nexus-red/50 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-nexus-card border border-nexus-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Images</h2>

          {/* Primary Image */}
          <div className="mb-5">
            <label className="block text-sm text-nexus-muted mb-1.5">Primary Image URL</label>
            <div className="flex gap-3 items-start">
              <input
                id="product-image-url"
                type="text"
                value={form.image_url}
                onChange={e => updateForm('image_url', e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 bg-nexus-dark border border-nexus-border rounded-lg px-4 py-2.5 text-sm focus:border-nexus-red/50 transition-colors"
              />
              <ImagePreview url={form.image_url} size="lg" />
            </div>
          </div>

          {/* Additional Images */}
          <div>
            <label className="block text-sm text-nexus-muted mb-1.5">Additional Image URLs</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newImageUrl}
                onChange={e => setNewImageUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
                placeholder="https://..."
                className="flex-1 bg-nexus-dark border border-nexus-border rounded-lg px-4 py-2.5 text-sm focus:border-nexus-red/50 transition-colors"
              />
              <button
                type="button"
                onClick={addImageUrl}
                className="px-3 py-2.5 bg-nexus-border/50 hover:bg-nexus-border rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {form.image_urls.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {form.image_urls.map((url, i) => (
                  <div key={i} className="relative group">
                    <ImagePreview url={url} size="md" />
                    <button
                      type="button"
                      onClick={() => removeImageUrl(i)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-nexus-danger rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-2.5 h-2.5 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Variants */}
        <div className="bg-nexus-card border border-nexus-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Variants</h2>
            <button
              type="button"
              onClick={addVariant}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-nexus-border/50 hover:bg-nexus-border rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Variant
            </button>
          </div>

          {variants.length === 0 ? (
            <p className="text-sm text-nexus-muted text-center py-4">
              No variants — click "Add Variant" to add color/storage/RAM options
            </p>
          ) : (
            <div className="space-y-3">
              {variants.map((v, i) => (
                <div key={i} className="flex flex-wrap gap-3 items-end p-3 bg-nexus-dark/50 border border-nexus-border/50 rounded-lg">
                  <div className="flex-1 min-w-[120px]">
                    <label className="block text-xs text-nexus-muted mb-1">Color</label>
                    <input
                      type="text"
                      value={v.color}
                      onChange={e => updateVariant(i, 'color', e.target.value)}
                      placeholder="Black"
                      className="w-full bg-nexus-dark border border-nexus-border rounded px-3 py-1.5 text-sm focus:border-nexus-red/50 transition-colors"
                    />
                  </div>
                  <div className="flex-1 min-w-[120px]">
                    <label className="block text-xs text-nexus-muted mb-1">Storage</label>
                    <input
                      type="text"
                      value={v.storage}
                      onChange={e => updateVariant(i, 'storage', e.target.value)}
                      placeholder="256GB"
                      className="w-full bg-nexus-dark border border-nexus-border rounded px-3 py-1.5 text-sm focus:border-nexus-red/50 transition-colors"
                    />
                  </div>
                  <div className="flex-1 min-w-[100px]">
                    <label className="block text-xs text-nexus-muted mb-1">RAM</label>
                    <input
                      type="text"
                      value={v.ram}
                      onChange={e => updateVariant(i, 'ram', e.target.value)}
                      placeholder="8GB"
                      className="w-full bg-nexus-dark border border-nexus-border rounded px-3 py-1.5 text-sm focus:border-nexus-red/50 transition-colors"
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-xs text-nexus-muted mb-1">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={v.price}
                      onChange={e => updateVariant(i, 'price', e.target.value)}
                      className="w-full bg-nexus-dark border border-nexus-border rounded px-3 py-1.5 text-sm focus:border-nexus-red/50 transition-colors"
                    />
                  </div>
                  <div className="w-20">
                    <label className="block text-xs text-nexus-muted mb-1">Stock</label>
                    <input
                      type="number"
                      min="0"
                      value={v.stock_quantity}
                      onChange={e => updateVariant(i, 'stock_quantity', e.target.value)}
                      className="w-full bg-nexus-dark border border-nexus-border rounded px-3 py-1.5 text-sm focus:border-nexus-red/50 transition-colors"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVariant(i)}
                    className="p-1.5 rounded-lg hover:bg-nexus-danger/10 text-nexus-muted hover:text-nexus-danger transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status */}
        <div className="bg-nexus-card border border-nexus-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Status</h2>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="active"
                checked={form.status === 'active'}
                onChange={e => updateForm('status', e.target.value)}
                className="accent-nexus-success"
              />
              <span className="text-sm">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="inactive"
                checked={form.status === 'inactive'}
                onChange={e => updateForm('status', e.target.value)}
                className="accent-nexus-danger"
              />
              <span className="text-sm">Inactive</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-nexus-red to-nexus-orange text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isEditing ? 'Update Product' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-2.5 text-sm font-medium border border-nexus-border rounded-lg hover:bg-nexus-border/50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}