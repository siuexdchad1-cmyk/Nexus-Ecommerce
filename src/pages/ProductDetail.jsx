import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiMinus, FiPlus, FiZap, FiArrowLeft, FiStar } from 'react-icons/fi';
import { getProductById, products } from '../data/products';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import TiltedCard from '../components/TiltedCard';
import './ProductDetail.css';

const sampleReviews = [
  { id: 1, name: 'Rohan K.', rating: 5, date: 'Jan 2025', text: 'Absolutely love this product! The quality is top-notch and it arrived quickly. Highly recommended.' },
  { id: 2, name: 'Sneha P.', rating: 4, date: 'Feb 2025', text: 'Great value for money. Works exactly as described. The packaging was excellent too.' },
  { id: 3, name: 'Aditya M.', rating: 5, date: 'Mar 2025', text: 'Best purchase I\'ve made this year! Performance is incredible and the build quality is premium.' },
  { id: 4, name: 'Kavya S.', rating: 4, date: 'Apr 2025', text: 'Solid product. Delivery was fast and the item was well-packaged. Would buy again.' },
  { id: 5, name: 'Vikram R.', rating: 5, date: 'May 2025', text: 'Exceeded all expectations. The product looks even better in person than in photos.' },
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const product = getProductById(id);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [addedAnim, setAddedAnim] = useState(false);
  const wishlisted = isWishlisted(product?.id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="not-found">
        <h2>Product not found</h2>
        <Link to="/shop" className="btn-primary">Back to Shop</Link>
      </div>
    );
  }

  const thumbnails = [product.image, product.image, product.image, product.image];
  const similar = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 6);

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 600);
  };

  const discount = product.discount || Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const savings = product.originalPrice - product.price;

  const renderStars = (r) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < Math.floor(r) ? '#ff6b00' : 'rgba(255,255,255,0.2)', fontSize: '16px' }}>★</span>
    ));

  return (
    <div className="product-detail page-transition">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-sep">›</span>
          <Link to="/shop" className="breadcrumb-link">Shop</Link>
          <span className="breadcrumb-sep">›</span>
          <Link to={`/shop?category=${product.category}`} className="breadcrumb-link">{product.category}</Link>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">{product.name}</span>
        </div>

        {/* Main Section */}
        <div className="pd-layout">
          {/* Left: Image Gallery */}
          <div className="pd-gallery">
            <div className="pd-main-img-wrap glass-card" style={{ padding: 0 }}>
              <TiltedCard
                imageSrc={thumbnails[activeImg]}
                altText={product.name}
                captionText={product.name}
                containerHeight="100%"
                containerWidth="100%"
                imageHeight="100%"
                imageWidth="100%"
                scaleOnHover={1.05}
                rotateAmplitude={10}
                showMobileWarning={false}
                showTooltip={true}
              />
              {discount > 0 && (
                <span className="pd-discount-badge" style={{ zIndex: 10 }}>-{discount}%</span>
              )}
            </div>
            <div className="pd-thumbnails">
              {thumbnails.map((img, i) => (
                <button
                   key={i}
                  className={`pd-thumb ${i === activeImg ? 'pd-thumb--active' : ''}`}
                  onClick={() => setActiveImg(i)}
                  id={`thumb-${i}`}
                >
                  <img src={img} alt={`View ${i + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="pd-info">
            <span className="pd-brand-pill">{product.brand}</span>
            <h1 className="pd-name">{product.name}</h1>

            <div className="pd-rating">
              {renderStars(product.rating)}
              <span className="pd-rating-num">{product.rating}</span>
              <span className="pd-reviews">({product.reviews.toLocaleString()} reviews)</span>
            </div>

            {/* Price */}
            <div className="pd-price-section glass-card">
              <div className="pd-prices">
                <span className="pd-price">${product.price.toLocaleString()}</span>
                {product.originalPrice > product.price && (
                  <span className="pd-original">${product.originalPrice.toLocaleString()}</span>
                )}
              </div>
              <span className="pd-savings">Save ${savings.toLocaleString()} ({discount}% OFF)</span>
            </div>

            {/* Stock */}
            <div className="pd-stock">
              {product.stock > 10 ? (
                <span className="stock-in">✓ In Stock ({product.stock} units)</span>
              ) : product.stock > 0 ? (
                <span className="stock-low">⚠ Only {product.stock} left!</span>
              ) : (
                <span className="stock-out">✕ Out of Stock</span>
              )}
            </div>

            {/* Specs Table */}
            {product.specs && (
              <div className="pd-specs glass-card">
                <h3 className="pd-specs-title">Specifications</h3>
                <table className="specs-table">
                  <tbody>
                    {Object.entries(product.specs)
                      .filter(([k, v]) => v && v !== 'N/A')
                      .map(([key, val]) => (
                        <tr key={key}>
                          <td className="spec-key">{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                          <td className="spec-val">{val}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Features */}
            {product.features && (
              <ul className="pd-features">
                {product.features.map((f, i) => (
                  <li key={i} className="pd-feature">
                    <span className="pd-feature-arrow">→</span>{f}
                  </li>
                ))}
              </ul>
            )}

            {/* Quantity */}
            <div className="pd-qty-row">
              <span className="pd-qty-label">Quantity:</span>
              <div className="qty-selector">
                <button
                  className="qty-btn"
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  id="qty-minus-btn"
                >
                  <FiMinus size={14} />
                </button>
                <span className="qty-display">{qty}</span>
                <button
                  className="qty-btn"
                  onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  id="qty-plus-btn"
                >
                  <FiPlus size={14} />
                </button>
              </div>
            </div>

            {/* Button Row */}
            <div className="pd-buttons">
              <button
                className={`pd-cart-btn ${addedAnim ? 'pd-cart-btn--added' : ''}`}
                onClick={handleAddToCart}
                id={`pd-add-cart-${product.id}`}
              >
                <FiShoppingCart size={18} />
                {addedAnim ? 'Added! ✓' : 'Add to Cart'}
              </button>
              <Link to="/cart" className="pd-buy-btn" onClick={handleAddToCart} id={`pd-buy-${product.id}`}>
                <FiZap size={18} />
                Buy Now
              </Link>
              <button
                className={`pd-wish-btn ${wishlisted ? 'pd-wish-btn--active' : ''}`}
                onClick={() => toggleWishlist(product)}
                id={`pd-wish-${product.id}`}
                title="Add to Wishlist"
              >
                <FiHeart size={20} />
              </button>
            </div>

            {/* Description */}
            {product.description && (
              <p className="pd-description">{product.description}</p>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="pd-reviews-section">
          <h2 className="pd-section-title">Customer Reviews</h2>
          <div className="reviews-summary">
            <div className="reviews-avg">
              <span className="avg-num">{product.rating}</span>
              <div className="avg-stars">{renderStars(product.rating)}</div>
              <span className="avg-count">{product.reviews.toLocaleString()} reviews</span>
            </div>
          </div>
          <div className="reviews-list">
            {sampleReviews.map(r => (
              <div key={r.id} className="review-card glass-card">
                <div className="review-header">
                  <div className="review-avatar">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <p className="review-name">{r.name}</p>
                    <p className="review-date">{r.date}</p>
                  </div>
                  <div className="review-stars">
                    {Array.from({ length: r.rating }, (_, i) => (
                      <span key={i} style={{ color: '#ff6b00' }}>★</span>
                    ))}
                  </div>
                </div>
                <p className="review-text">{r.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Similar Products */}
        {similar.length > 0 && (
          <div className="pd-similar">
            <h2 className="pd-section-title">Similar Products</h2>
            <div className="similar-scroll">
              {similar.map(p => (
                <div key={p.id} style={{ flexShrink: 0, width: '200px' }}>
                  <ProductCard product={p} compact />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
