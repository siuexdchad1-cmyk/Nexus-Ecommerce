import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { DatabaseBackup, Play, Trash2, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

// Import the existing static product data from the storefront
import { products as staticProducts } from '../../data/products.js'

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function Migrate() {
  const [running, setRunning] = useState(false)
  const [logs, setLogs] = useState([])
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  const [stats, setStats] = useState({ categories: 0, products: 0, errors: 0 })

  function addLog(message, type = 'info') {
    setLogs(prev => [...prev, { message, type, time: new Date().toLocaleTimeString() }])
  }

  async function runMigration() {
    setRunning(true)
    setLogs([])
    setProgress(0)
    setDone(false)
    setStats({ categories: 0, products: 0, errors: 0 })

    let catCount = 0
    let prodCount = 0
    let errCount = 0

    try {
      // ─── Step 1: Extract and insert categories ───
      addLog('📂 Extracting categories from product data...')
      const uniqueCategories = [...new Set(staticProducts.map(p => p.category))]
      addLog(`Found ${uniqueCategories.length} unique categories: ${uniqueCategories.join(', ')}`)

      const categoryMap = {} // name → UUID

      for (const catName of uniqueCategories) {
        const slug = slugify(catName)

        // Check if category already exists
        const { data: existing } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', slug)
          .single()

        if (existing) {
          categoryMap[catName] = existing.id
          addLog(`  ↳ "${catName}" already exists, skipping`, 'skip')
        } else {
          const { data, error } = await supabase
            .from('categories')
            .insert({ name: catName, slug })
            .select('id')
            .single()

          if (error) {
            addLog(`  ✗ Failed to insert "${catName}": ${error.message}`, 'error')
            errCount++
          } else {
            categoryMap[catName] = data.id
            catCount++
            addLog(`  ✓ Inserted "${catName}"`, 'success')
          }
        }
      }

      setStats(prev => ({ ...prev, categories: catCount }))
      addLog(`\n✅ Categories done: ${catCount} inserted\n`)
      setProgress(10)

      // ─── Step 2: Insert products ───
      addLog('📦 Migrating products...')
      const totalProducts = staticProducts.length

      for (let i = 0; i < totalProducts; i++) {
        const p = staticProducts[i]
        const categoryId = categoryMap[p.category] || null

        // Build description with specs
        let description = p.description || ''
        if (p.specs) {
          const specLines = Object.entries(p.specs)
            .filter(([, v]) => v && v !== 'N/A')
            .map(([k, v]) => `${k}: ${v}`)
            .join(', ')
          if (specLines) {
            description += `\n\nSpecs: ${specLines}`
          }
        }

        const productData = {
          name: p.name,
          serial_number: `NX-${String(p.id).padStart(3, '0')}`,
          sku: `NEXUS-${slugify(p.category).toUpperCase()}-${String(p.id).padStart(3, '0')}`,
          brand: p.brand || null,
          description: description.trim() || null,
          category_id: categoryId,
          price: p.price,
          discount_price: p.originalPrice && p.originalPrice > p.price ? p.originalPrice : null,
          stock_quantity: p.stock ?? 0,
          image_url: p.image || null,
          image_urls: [],
          status: 'active',
        }

        const { error } = await supabase.from('products').insert(productData)

        if (error) {
          // Check if it's a duplicate SKU error
          if (error.message.includes('duplicate') || error.message.includes('unique')) {
            addLog(`  ↳ #${p.id} "${p.name}" already exists, skipping`, 'skip')
          } else {
            addLog(`  ✗ #${p.id} "${p.name}": ${error.message}`, 'error')
            errCount++
          }
        } else {
          prodCount++
          if (prodCount % 10 === 0 || i === totalProducts - 1) {
            addLog(`  ✓ Inserted ${prodCount} products so far...`, 'success')
          }
        }

        // Update progress (10% for categories, 90% for products)
        setProgress(10 + Math.round(((i + 1) / totalProducts) * 90))
      }

      setStats({ categories: catCount, products: prodCount, errors: errCount })
      addLog(`\n🎉 Migration complete! ${prodCount} products inserted, ${errCount} errors.`)
    } catch (err) {
      addLog(`\n💥 Migration failed: ${err.message}`, 'error')
      toast.error('Migration failed')
    } finally {
      setRunning(false)
      setDone(true)
    }
  }

  async function clearAndRetry() {
    if (!confirm('This will DELETE all products and categories from the database. Continue?')) return

    setRunning(true)
    setLogs([])
    addLog('🗑️ Clearing existing data...')

    try {
      await supabase.from('stock_history').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabase.from('product_variants').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      addLog('✅ All data cleared')
      toast.success('Database cleared')
    } catch (err) {
      addLog(`✗ Clear failed: ${err.message}`, 'error')
      toast.error('Failed to clear database')
    }

    setRunning(false)
    setDone(false)
    setStats({ categories: 0, products: 0, errors: 0 })
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Data Migration</h1>
        <p className="text-nexus-muted text-sm mt-1">
          Import {staticProducts.length} products from the Nexus Store storefront into Supabase
        </p>
      </div>

      {/* Info card */}
      <div className="bg-nexus-card border border-nexus-border rounded-xl p-5">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-lg bg-nexus-orange/10 flex-shrink-0">
            <DatabaseBackup className="w-6 h-6 text-nexus-orange" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">What this does</h3>
            <ul className="text-sm text-nexus-muted space-y-1">
              <li>• Extracts unique categories and creates them in the <code className="text-nexus-orange">categories</code> table</li>
              <li>• Maps and inserts all {staticProducts.length} products into the <code className="text-nexus-orange">products</code> table</li>
              <li>• Auto-generates serial numbers (NX-001) and SKUs (NEXUS-SMARTPHONES-001)</li>
              <li>• Skips duplicate entries if you run it multiple times</li>
              <li>• This page can be removed after migration is complete</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={runMigration}
          disabled={running}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-nexus-red to-nexus-orange text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {running ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          {running ? 'Migrating...' : 'Start Migration'}
        </button>

        {done && (
          <button
            onClick={clearAndRetry}
            disabled={running}
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-nexus-danger/30 text-nexus-danger rounded-lg hover:bg-nexus-danger/10 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            Clear & Re-Migrate
          </button>
        )}
      </div>

      {/* Progress bar */}
      {(running || done) && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-nexus-muted">Progress</span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <div className="h-2 bg-nexus-border rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-nexus-red to-nexus-orange rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Stats */}
      {done && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-nexus-card border border-nexus-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-nexus-orange">{stats.categories}</p>
            <p className="text-xs text-nexus-muted mt-1">Categories</p>
          </div>
          <div className="bg-nexus-card border border-nexus-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-nexus-success">{stats.products}</p>
            <p className="text-xs text-nexus-muted mt-1">Products</p>
          </div>
          <div className="bg-nexus-card border border-nexus-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-nexus-danger">{stats.errors}</p>
            <p className="text-xs text-nexus-muted mt-1">Errors</p>
          </div>
        </div>
      )}

      {/* Log output */}
      {logs.length > 0 && (
        <div className="bg-nexus-dark border border-nexus-border rounded-xl p-4 max-h-96 overflow-y-auto">
          <h3 className="text-sm font-semibold mb-3 text-nexus-muted">Migration Log</h3>
          <div className="space-y-1 font-mono text-xs">
            {logs.map((log, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-nexus-muted flex-shrink-0">[{log.time}]</span>
                <span
                  className={
                    log.type === 'error'
                      ? 'text-nexus-danger'
                      : log.type === 'success'
                      ? 'text-nexus-success'
                      : log.type === 'skip'
                      ? 'text-nexus-warning'
                      : 'text-nexus-text'
                  }
                >
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}