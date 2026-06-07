import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiGrid, FiList, FiX, FiSliders } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { products, categories as allCats, brands as allBrands } from '../data/products';
import './Shop.css';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price ↑' },
  { value: 'price-desc', label: 'Price ↓' },
  { value: 'best-selling', label: 'Best Selling' },
  { value: 'top-rated', label: 'Top Rated' },
];

const PAGE_SIZE = 12;

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCats, setSelectedCats] = useState(
    searchParams.get('category') ? [searchParams.get('category')] : []
  );
  const [selectedBrands, setSelectedBrands] = useState(
    searchParams.get('brand') ? [searchParams.get('brand')] : []
  );
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(3000);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState('newest');
  const [view, setView] = useState('grid');
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Update filters when URL changes
  useEffect(() => {
    if (searchParams.get('category')) {
      setSelectedCats([searchParams.get('category')]);
    }
    if (searchParams.get('brand')) {
      setSelectedBrands([searchParams.get('brand')]);
    }
    if (searchParams.get('search')) {
      setSearchTerm(searchParams.get('search'));
    }
  }, [searchParams]);

  const toggleCat = (cat) => {
    setSelectedCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
    setPage(1);
  };

  const toggleBrand = (brand) => {
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCats([]);
    setSelectedBrands([]);
    setMinPrice(0);
    setMaxPrice(3000);
    setMinRating(0);
    setSort('newest');
    setPage(1);
  };

  const filtered = useMemo(() => {
    return products
      .filter(p => !selectedCats.length || selectedCats.includes(p.category))
      .filter(p => !selectedBrands.length || selectedBrands.includes(p.brand))
      .filter(p => p.price >= minPrice && p.price <= maxPrice)
      .filter(p => p.rating >= minRating)
      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   p.brand.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        if (sort === 'price-asc') return a.price - b.price;
        if (sort === 'price-desc') return b.price - a.price;
        if (sort === 'best-selling') return b.reviews - a.reviews;
        if (sort === 'top-rated') return b.rating - a.rating;
        return b.id - a.id; // newest
      });
  }, [searchTerm, selectedCats, selectedBrands, minPrice, maxPrice, minRating, sort]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  const catCounts = useMemo(() => {
    const counts = {};
    allCats.forEach(cat => {
      counts[cat] = products.filter(p => p.category === cat).length;
    });
    return counts;
  }, []);

  return (
    <div className="shop-page page-transition">
      <div className="shop-hero">
        <div className="container">
          <h1 className="shop-hero__title gradient-text">Shop All Products</h1>
          <p className="shop-hero__sub">Explore {products.length}+ premium electronics</p>
        </div>
      </div>

      <div className="container shop-layout">
        {/* Sidebar Overlay (Mobile) */}
        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`shop-sidebar glass-card ${sidebarOpen ? 'shop-sidebar--open' : ''}`} id="shop-sidebar">
          <div className="sidebar-header">
            <h3 className="sidebar-title">
              <FiSliders size={16} /> Filters
            </h3>
            <button className="sidebar-clear" onClick={clearFilters} id="clear-filters-btn">
              Clear All
            </button>
          </div>

          {/* Search */}
          <div className="filter-group">
            <label className="filter-label">Search</label>
            <div className="filter-search">
              <FiSearch size={14} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                className="filter-search-input"
                id="shop-search-input"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="filter-clear-x">
                  <FiX size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="filter-group">
            <label className="filter-label">Categories</label>
            {allCats.map(cat => (
              <label key={cat} className="filter-check">
                <input
                  type="checkbox"
                  checked={selectedCats.includes(cat)}
                  onChange={() => toggleCat(cat)}
                  id={`cat-${cat}`}
                />
                <span className="checkmark" />
                <span className="filter-check-label">{cat}</span>
                <span className="filter-check-count">{catCounts[cat]}</span>
              </label>
            ))}
          </div>

          {/* Brands */}
          <div className="filter-group">
            <label className="filter-label">Brands</label>
            <div className="brand-filters">
              {allBrands.map(brand => (
                <label key={brand} className="filter-check">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    id={`brand-${brand}`}
                  />
                  <span className="checkmark" />
                  <span className="filter-check-label">{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="filter-group">
            <label className="filter-label">
              Price Range: <span style={{ color: 'var(--orange)' }}>${minPrice} – ${maxPrice}</span>
            </label>
            <div className="price-range">
              <input
                type="range"
                min="0"
                max="3000"
                step="50"
                value={minPrice}
                onChange={e => { setMinPrice(Number(e.target.value)); setPage(1); }}
                className="range-slider"
                id="min-price-slider"
              />
              <input
                type="range"
                min="0"
                max="3000"
                step="50"
                value={maxPrice}
                onChange={e => { setMaxPrice(Number(e.target.value)); setPage(1); }}
                className="range-slider"
                id="max-price-slider"
              />
            </div>
          </div>

          {/* Rating */}
          <div className="filter-group">
            <label className="filter-label">Minimum Rating</label>
            {[0, 3, 4, 4.5].map(r => (
              <label key={r} className="filter-check">
                <input
                  type="radio"
                  name="rating"
                  checked={minRating === r}
                  onChange={() => { setMinRating(r); setPage(1); }}
                  id={`rating-${r}`}
                />
                <span className="checkmark" />
                <span className="filter-check-label">
                  {r === 0 ? 'All Ratings' : `${r}★ & Above`}
                </span>
              </label>
            ))}
          </div>
        </aside>

        {/* Main */}
        <main className="shop-main">
          {/* Toolbar */}
          <div className="shop-toolbar">
            <div className="toolbar-left">
              <button
                className="mobile-filter-btn"
                onClick={() => setSidebarOpen(true)}
                id="mobile-filter-btn"
              >
                <FiSliders size={16} /> Filters
              </button>
              <span className="results-count">
                Showing <strong>{visible.length}</strong> of <strong>{filtered.length}</strong> products
              </span>
            </div>
            <div className="toolbar-right">
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="sort-select"
                id="sort-select"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <div className="view-toggle">
                <button
                  className={`view-btn ${view === 'grid' ? 'view-btn--active' : ''}`}
                  onClick={() => setView('grid')}
                  id="grid-view-btn"
                  title="Grid view"
                >
                  <FiGrid size={16} />
                </button>
                <button
                  className={`view-btn ${view === 'list' ? 'view-btn--active' : ''}`}
                  onClick={() => setView('list')}
                  id="list-view-btn"
                  title="List view"
                >
                  <FiList size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedCats.length > 0 || selectedBrands.length > 0 || searchTerm) && (
            <div className="active-filters">
              {selectedCats.map(c => (
                <span key={c} className="filter-tag">
                  {c} <button onClick={() => toggleCat(c)}><FiX size={10} /></button>
                </span>
              ))}
              {selectedBrands.map(b => (
                <span key={b} className="filter-tag">
                  {b} <button onClick={() => toggleBrand(b)}><FiX size={10} /></button>
                </span>
              ))}
              {searchTerm && (
                <span className="filter-tag">
                  "{searchTerm}" <button onClick={() => setSearchTerm('')}><FiX size={10} /></button>
                </span>
              )}
            </div>
          )}

          {/* Products */}
          {filtered.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🔍</span>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search term</p>
              <button className="btn-primary" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <>
              <div className={`products-${view === 'grid' ? 'grid' : 'list'}`}>
                {visible.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {hasMore && (
                <div className="load-more-wrap">
                  <button
                    className="load-more-btn"
                    onClick={() => setPage(p => p + 1)}
                    id="load-more-btn"
                  >
                    Load More ({filtered.length - visible.length} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
