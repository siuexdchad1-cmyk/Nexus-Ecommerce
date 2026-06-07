import React from 'react';
import { Link } from 'react-router-dom';
import { FiPackage } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import './Orders.css';

// 4 random recommended products
const recommended = [...products].sort(() => Math.random() - 0.5).slice(0, 4);

const Orders = () => (
  <div className="orders-page page-transition">
    <div className="container">
      {/* Account Info Header */}
      <div className="account-header glass-card" style={{ padding: '24px 30px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #ff3c3c, #ff6b00)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '24px',
          fontWeight: '900',
          fontStyle: 'italic',
          boxShadow: '0 8px 20px rgba(255, 60, 60, 0.3)',
          flexShrink: 0
        }}>
          AT
        </div>
        <div>
          <h1 className="orders-rec-title" style={{ margin: 0, fontSize: '26px', fontWeight: '900', textTransform: 'uppercase', fontStyle: 'italic', background: 'linear-gradient(135deg, #ffffff, #aaaaaa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Arya Tare
          </h1>
          <p style={{ color: '#666666', fontSize: '13px', fontFamily: 'Space Mono, monospace', marginTop: '4px' }}>
            ID: NEXUS-USER-482019
          </p>
        </div>
      </div>

      {/* Empty State */}
      <div className="orders-empty glass-card">
        <div className="orders-icon-ring">
          <FiPackage size={48} className="orders-icon" />
        </div>
        <h2 className="orders-empty__title">No Orders Yet</h2>
        <p className="orders-empty__sub">
          Looks like you haven't placed any orders yet.<br />
          Start shopping and your orders will appear here.
        </p>
        <div className="orders-empty__btns">
          <Link to="/shop" className="orders-btn-primary" id="shop-now-orders-btn">
            Shop Now →
          </Link>
          <Link to="/shop" className="orders-btn-secondary" id="browse-deals-orders-btn">
            Browse Deals
          </Link>
        </div>
      </div>

      {/* Recommended */}
      <div className="orders-recommended">
        <h2 className="orders-rec-title gradient-text">Recommended For You</h2>
        <div className="orders-rec-grid">
          {recommended.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Orders;
