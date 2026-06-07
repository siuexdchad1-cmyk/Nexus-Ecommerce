import React from 'react';
import './Testimonials.css';

const testimonials = [
  {
    id: 1,
    name: 'Aryan Sharma',
    role: 'Tech Enthusiast',
    avatar: '👨‍💻',
    rating: 5,
    text: 'Nexus Store is my go-to for all electronics. The prices are unbeatable and delivery is always fast. Got my MacBook Pro in just 2 days!',
  },
  {
    id: 2,
    name: 'Priya Mehta',
    role: 'Content Creator',
    avatar: '👩‍🎨',
    rating: 5,
    text: 'Amazing collection of cameras and accessories. The product descriptions are detailed and the customer service team is super responsive.',
  },
  {
    id: 3,
    name: 'Karan Patel',
    role: 'Pro Gamer',
    avatar: '🎮',
    rating: 5,
    text: 'Best gaming peripherals selection online! Got the ROG keyboard and mouse combo at a steal. The quality is exactly as described.',
  },
];

const Testimonials = () => (
  <section className="testimonials section-padding">
    <div className="container">
      <div className="section-header" style={{ justifyContent: 'center' }}>
        <h2 className="section-title" style={{ textAlign: 'center' }}>
          What Our Customers Say
        </h2>
      </div>
      <div className="testimonials-grid">
        {testimonials.map(t => (
          <div key={t.id} className="testimonial-card glass-card">
            <div className="test-stars">
              {Array.from({ length: t.rating }, (_, i) => (
                <span key={i} style={{ color: 'var(--orange)', fontSize: '16px' }}>★</span>
              ))}
            </div>
            <p className="test-text">"{t.text}"</p>
            <div className="test-author">
              <div className="test-avatar">{t.avatar}</div>
              <div>
                <p className="test-name">{t.name}</p>
                <p className="test-role">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
