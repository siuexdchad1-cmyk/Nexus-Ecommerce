import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import ConfirmModal from '../components/ConfirmModal'
import { Plus, Pencil, Trash2, Check, X, FolderTree } from 'lucide-react'
import toast from 'react-hot-toast'

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [adding, setAdding] = useState(false)

  useEffect(() => { fetchCategories() }, [])

  async function fetchCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*, products(count)')
      .order('name')
    if (error) toast.error('Failed to fetch categories')
    else setCategories(data || [])
    setLoading(false)
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!newName.trim()) return
    setAdding(true)
    const slug = slugify(newName)
    const { error } = await supabase.from('categories').insert({ name: newName.trim(), slug })
    if (error) {
      toast.error(error.message.includes('duplicate') ? 'Category already exists' : 'Failed to add category')
    } else {
      toast.success(`"${newName}" added`)
      setNewName('')
      fetchCategories()
    }
    setAdding(false)
  }

  async function handleUpdate(id) {
    if (!editName.trim()) return
    const slug = slugify(editName)
    const { error } = await supabase.from('categories').update({ name: editName.trim(), slug }).eq('id', id)
    if (error) {
      toast.error('Failed to update category')
    } else {
      toast.success('Category updated')
      setEditingId(null)
      fetchCategories()
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    const { error } = await supabase.from('categories').delete().eq('id', deleteTarget.id)
    if (error) {
      toast.error('Failed to delete category')
    } else {
      toast.success(`"${deleteTarget.name}" deleted`)
      fetchCategories()
    }
    setDeleting(false)
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
        <p className="text-nexus-muted text-sm mt-1">Organize your products into categories</p>
      </div>

      {/* Add category form */}
      <form onSubmit={handleAdd} className="flex gap-3 max-w-lg">
        <div className="flex-1 flex items-center bg-nexus-card/40 border border-nexus-border/80 rounded-xl px-3.5 py-2 group focus-within:border-nexus-red/40 focus-within:ring-1 focus-within:ring-nexus-red/10 transition-all duration-200">
          <FolderTree className="w-4 h-4 text-nexus-muted group-focus-within:text-nexus-red transition-colors duration-200 flex-shrink-0 mr-2.5" />
          <input
            id="new-category-name"
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Category name (e.g. Smartphones)"
            className="w-full bg-transparent border-none text-sm text-nexus-text placeholder:text-nexus-muted/40 outline-none focus:ring-0 p-0"
            required
          />
        </div>
        <button
          type="submit"
          disabled={adding || !newName.trim()}
          className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-nexus-red to-nexus-orange text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex-shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </form>

      {/* Categories list */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-3 border-nexus-red border-t-transparent rounded-full animate-spin" />
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-nexus-card border border-nexus-border rounded-xl p-12 text-center">
          <FolderTree className="w-12 h-12 text-nexus-muted mx-auto mb-3" />
          <p className="text-nexus-muted">No categories yet</p>
        </div>
      ) : (
        <div className="bg-nexus-card border border-nexus-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-nexus-border">
                <th className="text-left p-4 text-nexus-muted font-medium">Name</th>
                <th className="text-left p-4 text-nexus-muted font-medium hidden sm:table-cell">Slug</th>
                <th className="text-left p-4 text-nexus-muted font-medium">Products</th>
                <th className="text-right p-4 text-nexus-muted font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id} className="border-b border-nexus-border/50 hover:bg-nexus-card-hover transition-colors">
                  <td className="p-4">
                    {editingId === cat.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleUpdate(cat.id)}
                        className="bg-nexus-dark/60 border border-nexus-border rounded-lg px-2.5 py-1.5 text-sm w-48 focus:border-nexus-red/40 outline-none transition-colors"
                        autoFocus
                      />
                    ) : (
                      <span className="font-medium">{cat.name}</span>
                    )}
                  </td>
                  <td className="p-4 text-nexus-muted hidden sm:table-cell">{cat.slug}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full bg-nexus-border/50 text-xs font-medium">
                      {cat.products?.[0]?.count ?? 0}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      {editingId === cat.id ? (
                        <>
                          <button onClick={() => handleUpdate(cat.id)} className="p-2 rounded-lg hover:bg-nexus-success/10 text-nexus-success transition-colors" title="Save">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-2 rounded-lg hover:bg-nexus-border/50 text-nexus-muted transition-colors" title="Cancel">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => { setEditingId(cat.id); setEditName(cat.name) }}
                            className="p-2 rounded-lg hover:bg-nexus-border/50 text-nexus-muted hover:text-nexus-text transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(cat)}
                            className="p-2 rounded-lg hover:bg-nexus-danger/10 text-nexus-muted hover:text-nexus-danger transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? Products in this category will become uncategorized.`}
        isLoading={deleting}
      />
    </div>
  )
}
