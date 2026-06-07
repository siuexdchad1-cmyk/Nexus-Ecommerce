import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackgroundBlobs from './components/BackgroundBlobs';
import LiquidChrome from './components/LiquidChrome';
import TargetCursor from './components/TargetCursor';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Brands from './pages/Brands';
import Support from './pages/Support';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import ProductDetail from './pages/ProductDetail';
import './App.css';

const AppLayout = () => {
  const location = useLocation();
  const [disableFX, setDisableFX] = useState(() => {
    return localStorage.getItem('disable_fx') === 'true';
  });

  const toggleFX = () => {
    setDisableFX(prev => {
      const newVal = !prev;
      localStorage.setItem('disable_fx', String(newVal));
      return newVal;
    });
  };

  return (
    <>
      {!disableFX && <BackgroundBlobs />}
      {!disableFX && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', opacity: 0.2 }}>
          <LiquidChrome
            baseColor={[0.1, 0.1, 0.1]}
            speed={0.4}
            amplitude={0.6}
            interactive={true}
          />
        </div>
      )}
      {!disableFX && (
        <TargetCursor 
          targetSelector="a, button, .cursor-target, select, input[type='submit'], .checkmark, .range-slider"
          spinDuration={2}
          hideDefaultCursor={true}
          parallaxOn={true}
        />
      )}

      {/* Floating Performance Switcher */}
      <button 
        onClick={toggleFX}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          background: 'rgba(17, 17, 17, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '50px',
          color: '#ffffff',
          padding: '8px 16px',
          fontSize: '11px',
          fontWeight: '700',
          fontFamily: 'Space Mono, monospace',
          letterSpacing: '0.5px',
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'all 0.3s'
        }}
        className="performance-toggle-btn"
      >
        <span style={{ 
          width: '6px', 
          height: '6px', 
          borderRadius: '50%', 
          background: disableFX ? '#ff3c3c' : '#4ade80',
          boxShadow: disableFX ? '0 0 8px #ff3c3c' : '0 0 8px #4ade80'
        }} />
        {disableFX ? 'FX: OFF' : 'FX: ON'}
      </button>

      <AnnouncementBar />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/brands" element={<Brands />} />
        <Route path="/support" element={<Support />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="*" element={
          <div style={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', height: '60vh', gap: '16px',
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            <h1 style={{ fontSize: '80px', color: '#ff3c3c' }}>404</h1>
            <p style={{ color: 'var(--text-muted)' }}>Page not found</p>
            <a href="/" style={{
              background: 'var(--gradient-main)',
              color: '#fff', padding: '12px 28px', borderRadius: '8px',
              textDecoration: 'none', fontWeight: '600'
            }}>Go Home</a>
          </div>
        } />
      </Routes>
      <Footer />
    </>
  );
};

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
