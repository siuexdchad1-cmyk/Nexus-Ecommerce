import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiTag, FiLock, FiPackage, FiCheck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import './Cart.css';

const VALID_COUPON = 'NEXUS25';

// 4 random recommended products
const recommended = [...products].sort(() => Math.random() - 0.5).slice(0, 4);

const Cart = () => {
  const { cartItems, cartCount, cartTotal, cartSavings, removeFromCart, updateQuantity, clearCart } = useCart();
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [removing, setRemoving] = useState(null);

  const tax = cartTotal * 0.18;
  const couponDiscount = couponApplied ? cartTotal * 0.25 : 0;
  const total = cartTotal - couponDiscount + tax;

  const handleApplyCoupon = () => {
    if (coupon.trim().toUpperCase() === VALID_COUPON) {
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try NEXUS25');
      setCouponApplied(false);
    }
  };

  const handleRemove = (id) => {
    setRemoving(id);
    setTimeout(() => {
      removeFromCart(id);
      setRemoving(null);
    }, 300);
  };

  if (cartCount === 0) {
    return (
      <div className="cart-empty page-transition">
        <div className="cart-empty__icon">
          <FiShoppingBag size={80} />
        </div>
        <h2 className="cart-empty__title">Your cart is empty</h2>
        <p className="cart-empty__sub">Looks like you haven't added anything yet</p>
        <Link to="/shop" className="btn-gold" id="continue-shopping-btn">
          Continue Shopping →
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page page-transition">
      <div className="container">
        <div className="cart-header">
          <h1 className="cart-title gradient-text">Shopping Cart</h1>
          <span className="cart-count-label">{cartCount} item{cartCount !== 1 ? 's' : ''}</span>
          <button className="clear-cart-btn" onClick={clearCart} id="clear-cart-btn">Clear Cart</button>
        </div>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {cartItems.map(item => (
              <div
                key={item.id}
                className={`cart-item glass-card ${removing === item.id ? 'cart-item--removing' : ''}`}
                id={`cart-item-${item.id}`}
              >
                <Link to={`/product/${item.id}`} className="cart-item__img-wrap">
                  <img src={item.image} alt={item.name} className="cart-item__img" />
                </Link>
                <div className="cart-item__info">
                  <Link to={`/product/${item.id}`} className="cart-item__name">{item.name}</Link>
                  <p className="cart-item__brand">{item.brand} · {item.category}</p>
                  {item.specs && item.specs.storage && item.specs.storage !== 'N/A' && (
                    <p className="cart-item__spec">{item.specs.storage}</p>
                  )}
                </div>
                <div className="cart-item__qty">
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    id={`cart-qty-minus-${item.id}`}
                  >
                    <FiMinus size={12} />
                  </button>
                  <span className="qty-display">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    id={`cart-qty-plus-${item.id}`}
                  >
                    <FiPlus size={12} />
                  </button>
                </div>
                <div className="cart-item__price">
                  <span className="cart-item__total">${(item.price * item.quantity).toLocaleString()}</span>
                  <span className="cart-item__unit">${item.price}/ea</span>
                </div>
                <button
                  className="cart-item__remove"
                  onClick={() => handleRemove(item.id)}
                  id={`cart-remove-${item.id}`}
                  title="Remove item"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h2 className="summary-title">Order Summary</h2>

            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              {cartSavings > 0 && (
                <div className="summary-row summary-row--savings">
                  <span>Savings</span>
                  <span>-${cartSavings.toFixed(2)}</span>
                </div>
              )}
              {couponApplied && (
                <div className="summary-row summary-row--coupon">
                  <span>Coupon (NEXUS25)</span>
                  <span>-${couponDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-row summary-row--shipping">
                <span>Shipping</span>
                <span className="free-label">FREE</span>
              </div>
              <div className="summary-row">
                <span>Tax (18%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="summary-divider" />
            <div className="summary-total">
              <span>Total</span>
              <span className="total-amount">${total.toFixed(2)}</span>
            </div>

            {/* Coupon */}
            <div className="coupon-section">
              <label className="coupon-label">
                <FiTag size={14} /> Have a coupon?
              </label>
              <div className="coupon-row">
                <input
                  type="text"
                  placeholder="Enter code (NEXUS25)"
                  value={coupon}
                  onChange={e => { setCoupon(e.target.value); setCouponError(''); setCouponApplied(false); }}
                  className="coupon-input"
                  id="coupon-input"
                />
                <button className="coupon-btn" onClick={handleApplyCoupon} id="coupon-apply-btn">
                  Apply
                </button>
              </div>
              {couponError && <p className="coupon-error">{couponError}</p>}
              {couponApplied && <p className="coupon-success">✓ Coupon applied! 25% OFF</p>}
            </div>

            <button className="checkout-btn" id="checkout-btn">
              Proceed to Checkout →
            </button>

            <div className="security-row">
              <span><FiLock size={11} /> Secure Checkout</span>
              <span><FiPackage size={11} /> Free Returns</span>
              <span><FiCheck size={11} /> Verified</span>
            </div>
          </div>
        </div>

        {/* You Might Also Like */}
        <div className="cart-recommended">
          <h2 className="cart-rec-title">You Might Also Like</h2>
          <div className="cart-rec-grid">
            {recommended.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
