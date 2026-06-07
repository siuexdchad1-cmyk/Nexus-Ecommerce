import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiZap } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './DealsOfDay.css';

const deals = [
  {
    id: 40,
    badge: 'GAMING GEAR',
    badgeType: 'red',
    name: 'Sony PlayStation VR Headset 2',
    rating: 4.8,
    reviews: 1234,
    price: 299,
    originalPrice: 549,
    soldPercent: 62,
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400&q=80',
    category: 'Gaming',
  },
  {
    id: 21,
    badge: 'LAPTOP',
    badgeType: 'orange',
    name: 'DELL Alienware M15 AMD Ryzen 7',
    rating: 4.9,
    reviews: 543,
    price: 1299,
    originalPrice: 1799,
    soldPercent: 78,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&q=80',
    category: 'Laptops',
  },
];

const getEndTime = () => {
  const end = new Date();
  end.setHours(23, 59, 59, 0);
  return end;
};

const DealsOfDay = () => {
  const { addToCart } = useCart();
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const end = getEndTime();
    const tick = () => {
      const now = new Date();
      const diff = Math.max(0, end - now);
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');

  const renderStars = (r) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < Math.floor(r) ? '#ff6b00' : 'rgba(255,255,255,0.2)', fontSize: '13px' }}>★</span>
    ));

  return (
    <section className="deals-section section-padding">
      <div className="container">
        {/* Header */}
        <div className="deals-header">
          <div className="deals-header__left">
            <h2 className="section-title">Deals of the Day</h2>
          </div>
          <div className="countdown">
            <div className="countdown__unit">
              <span className="countdown__num">{pad(timeLeft.h)}</span>
              <span className="countdown__label">Hours</span>
            </div>
            <span className="countdown__sep">:</span>
            <div className="countdown__unit">
              <span className="countdown__num">{pad(timeLeft.m)}</span>
              <span className="countdown__label">Mins</span>
            </div>
            <span className="countdown__sep">:</span>
            <div className="countdown__unit">
              <span className="countdown__num">{pad(timeLeft.s)}</span>
              <span className="countdown__label">Secs</span>
            </div>
          </div>
        </div>

        {/* Deal Cards */}
        <div className="deals-grid">
          {deals.map((deal) => {
            const discount = Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100);
            return (
              <div className="deal-card" key={deal.id} id={`deal-card-${deal.id}`}>
                <div className="deal-card__img-side">
                  <div className="deal-img-glow" />
                  <img src={deal.image} alt={deal.name} className="deal-img" loading="lazy" />
                </div>
                <div className="deal-card__info">
                  <span className={`deal-badge deal-badge--${deal.badgeType}`}>{deal.badge}</span>
                  <h3 className="deal-name">{deal.name}</h3>
                  <div className="deal-stars">
                    {renderStars(deal.rating)}
                    <span className="deal-reviews">({deal.reviews.toLocaleString()} reviews)</span>
                  </div>
                  <div className="deal-prices">
                    <span className="deal-price">${deal.price.toLocaleString()}</span>
                    <span className="deal-original">${deal.originalPrice.toLocaleString()}</span>
                    <span className="deal-save">Save {discount}%</span>
                  </div>
                  <div className="deal-progress-wrap">
                    <div className="deal-progress-label">
                      <span>Sold: <strong>{deal.soldPercent}%</strong></span>
                      <span>Available: {100 - deal.soldPercent}%</span>
                    </div>
                    <div className="deal-progress-bar">
                      <div
                        className="deal-progress-fill"
                        style={{ width: `${deal.soldPercent}%` }}
                      />
                    </div>
                  </div>
                  <div className="deal-actions">
                    <button
                      className="deal-btn deal-btn--cart"
                      onClick={() => addToCart(deal)}
                      id={`deal-cart-${deal.id}`}
                    >
                      <FiShoppingCart size={16} />
                      Add to Cart
                    </button>
                    <Link to={`/product/${deal.id}`} className="deal-btn deal-btn--buy" id={`deal-buy-${deal.id}`}>
                      <FiZap size={16} />
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DealsOfDay;
