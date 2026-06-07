import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiStar, FiEye } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import GlassSurface from './GlassSurface';
import './ProductCard.css';

const ProductCard = ({ product, compact = false }) => {
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const imgRef = useRef(null);
  const cardRef = useRef(null);
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);

    // Fly-to-cart animation
    const cartBtn = document.getElementById('cart-icon-btn');
    const img = imgRef.current;
    if (!cartBtn || !img) return;

    const imgRect = img.getBoundingClientRect();
    const cartRect = cartBtn.getBoundingClientRect();

    const clone = document.createElement('img');
    clone.src = product.image;
    clone.className = 'fly-clone';
    clone.style.left = `${imgRect.left + imgRect.width / 2 - 30}px`;
    clone.style.top = `${imgRect.top + imgRect.height / 2 - 30}px`;
    document.body.appendChild(clone);

    requestAnimationFrame(() => {
      const dx = cartRect.left + cartRect.width / 2 - (imgRect.left + imgRect.width / 2);
      const dy = cartRect.top + cartRect.height / 2 - (imgRect.top + imgRect.height / 2);
      clone.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.6s ease';
      clone.style.transform = `translate(${dx}px, ${dy}px) scale(0.1)`;
      clone.style.opacity = '0';
      setTimeout(() => clone.remove(), 650);
    });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < full ? 'star--full' : i === full && half ? 'star--half' : 'star--empty'}`}>★</span>
    ));
  };

  const getBadgeClass = (badge) => {
    if (!badge) return '';
    const b = badge.toUpperCase();
    if (b === 'NEW') return 'badge--new';
    if (b === 'HOT') return 'badge--hot';
    if (b === 'SALE') return 'badge--sale';
    return '';
  };

  const discount = product.discount || Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  if (compact) {
    return (
      <Link to={`/product/${product.id}`} className="product-card product-card--compact" ref={cardRef} id={`product-card-${product.id}`} style={{ background: 'none', border: 'none', padding: 0 }}>
        <GlassSurface borderRadius={16} width="100%" height="100%" backgroundOpacity={0.03}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingBottom: '12px' }}>
            {product.badge && <span className={`product-badge ${getBadgeClass(product.badge)}`}>{product.badge}</span>}
            {discount > 0 && <span className="product-discount">-{discount}%</span>}
            <div className="product-img-wrap">
              <img ref={imgRef} src={product.image} alt={product.name} className="product-img" loading="lazy" />
            </div>
            <div className="product-info" style={{ padding: '8px 12px 0' }}>
              <p className="product-brand">{product.brand}</p>
              <p className="product-name">{product.name}</p>
              <div className="product-stars">
                {renderStars(product.rating)}
                <span className="product-reviews">({product.reviews})</span>
              </div>
              <div className="product-prices">
                <span className="product-price">${product.price}</span>
                {product.originalPrice > product.price && (
                  <span className="product-original">${product.originalPrice}</span>
                )}
              </div>
              <button className="product-cart-btn" onClick={handleAddToCart} id={`add-cart-${product.id}`}>
                <FiShoppingCart size={14} />
                Add to Cart
              </button>
            </div>
          </div>
        </GlassSurface>
      </Link>
    );
  }

  return (
    <Link to={`/product/${product.id}`} className="product-card" ref={cardRef} id={`product-card-${product.id}`} style={{ background: 'none', border: 'none', padding: 0 }}>
      <GlassSurface borderRadius={16} width="100%" height="100%" backgroundOpacity={0.03}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingBottom: '12px' }}>
          {product.badge && <span className={`product-badge ${getBadgeClass(product.badge)}`}>{product.badge}</span>}
          {discount > 0 && <span className="product-discount">-{discount}%</span>}
          
          <div className="product-actions">
            <button className={`action-btn ${wishlisted ? 'action-btn--active' : ''}`} onClick={handleWishlist} title="Wishlist">
              <FiHeart size={16} />
            </button>
            <button className="action-btn" title="Quick View" onClick={(e) => { e.preventDefault(); }}>
              <FiEye size={16} />
            </button>
          </div>

          <div className="product-img-wrap">
            <img ref={imgRef} src={product.image} alt={product.name} className="product-img" loading="lazy" />
          </div>

          <div className="product-info">
            <p className="product-brand">{product.brand}</p>
            <p className="product-name">{product.name}</p>
            <div className="product-stars">
              {renderStars(product.rating)}
              <span className="product-reviews">({product.reviews.toLocaleString()})</span>
            </div>
            <div className="product-prices">
              <span className="product-price">${product.price.toLocaleString()}</span>
              {product.originalPrice > product.price && (
                <span className="product-original">${product.originalPrice.toLocaleString()}</span>
              )}
            </div>
            <button className="product-cart-btn product-cart-btn--full" onClick={handleAddToCart} id={`add-cart-${product.id}`}>
              <FiShoppingCart size={14} />
              Add to Cart
            </button>
          </div>
        </div>
      </GlassSurface>
    </Link>
  );
};

export default ProductCard;
