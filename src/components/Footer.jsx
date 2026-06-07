import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiInstagram, FiTwitter, FiYoutube, FiFacebook, FiLinkedin,
  FiMapPin, FiMail, FiPhone, FiClock, FiArrowRight, FiSend
} from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const quickLinks = ['Home', 'Shop', 'Brands', 'Support', 'Orders', 'Cart'];
  const categories = ['Smartphones', 'Laptops', 'Tablets', 'Headphones', 'Gaming', 'Smartwatches', 'Cameras', 'Accessories'];

  return (
    <footer className="footer">
      {/* Newsletter */}
      <div className="footer-newsletter">
        <div className="newsletter-glow" />
        <div className="container newsletter-inner">
          <h2 className="newsletter-title gradient-text">Stay in the Loop</h2>
          <p className="newsletter-sub">Get exclusive deals, new launches &amp; tech news</p>
          <form className="newsletter-form" onSubmit={handleSubscribe} id="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email address..."
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="newsletter-input"
              id="newsletter-email"
              required
            />
            <button type="submit" className="newsletter-btn" id="newsletter-submit">
              <FiSend size={16} />
              {subscribed ? 'Subscribed! ✓' : 'Subscribe'}
            </button>
          </form>
          {subscribed && (
            <p className="newsletter-success">🎉 Welcome to Nexus! Check your inbox for a 15% off coupon.</p>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="footer-main">
        <div className="container footer-grid">
          {/* Col 1 — Brand */}
          <div className="footer-col">
            <Link to="/" className="footer-logo">NEXUS</Link>
            <p className="footer-tagline">Premium Electronics Store</p>
            <p className="footer-about">
              Nexus Store brings you the latest in technology — from flagship smartphones to pro gaming gear — at prices that don't compromise.
            </p>
            <div className="footer-socials">
              {[
                { icon: <FiInstagram size={18} />, label: 'Instagram', id: 'social-instagram' },
                { icon: <FiTwitter size={18} />, label: 'Twitter', id: 'social-twitter' },
                { icon: <FiYoutube size={18} />, label: 'YouTube', id: 'social-youtube' },
                { icon: <FiFacebook size={18} />, label: 'Facebook', id: 'social-facebook' },
                { icon: <FiLinkedin size={18} />, label: 'LinkedIn', id: 'social-linkedin' },
              ].map(s => (
                <button key={s.label} className="social-btn" title={s.label} id={s.id}>
                  {s.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">QUICK LINKS</h4>
            <ul className="footer-links">
              {quickLinks.map(link => (
                <li key={link}>
                  <Link to={`/${link.toLowerCase() === 'home' ? '' : link.toLowerCase()}`} className="footer-link">
                    <FiArrowRight size={12} className="footer-link-arrow" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Categories */}
          <div className="footer-col">
            <h4 className="footer-col-title">CATEGORIES</h4>
            <ul className="footer-links">
              {categories.map(cat => (
                <li key={cat}>
                  <Link to={`/shop?category=${cat}`} className="footer-link">
                    <FiArrowRight size={12} className="footer-link-arrow" />
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div className="footer-col">
            <h4 className="footer-col-title">CONTACT US</h4>
            <ul className="footer-contact">
              <li className="contact-item">
                <FiMapPin size={16} className="contact-ico" />
                <span>123 Tech Street, Cyber Hub<br />Mumbai, Maharashtra 400001</span>
              </li>
              <li className="contact-item">
                <FiMail size={16} className="contact-ico" />
                <span>support@nexusstore.in</span>
              </li>
              <li className="contact-item">
                <FiPhone size={16} className="contact-ico" />
                <span>+91 98765 43210</span>
              </li>
              <li className="contact-item">
                <FiClock size={16} className="contact-ico" />
                <span>Mon–Sat: 9:00 AM – 8:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p className="footer-copyright">© 2025 Nexus Store. All Rights Reserved.</p>
          <div className="footer-legal">
            <a href="#" className="footer-legal-link">Privacy Policy</a>
            <span className="footer-legal-sep">|</span>
            <a href="#" className="footer-legal-link">Terms &amp; Conditions</a>
            <span className="footer-legal-sep">|</span>
            <a href="#" className="footer-legal-link">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
