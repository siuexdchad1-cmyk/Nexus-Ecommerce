import React, { useState } from 'react';
import { FiMessageCircle, FiPhoneCall, FiMail, FiSend } from 'react-icons/fi';
import './Support.css';

const faqs = [
  { q: 'What is the return policy?', a: '30-day hassle-free returns on all products. Items must be in original packaging.' },
  { q: 'How long does delivery take?', a: 'Standard delivery: 3-5 business days. Express: 1-2 days. Free shipping on orders over ₹999.' },
  { q: 'Do you offer warranty?', a: 'Yes! All products come with manufacturer warranty. Electronics typically have 1-year warranty.' },
  { q: 'How can I track my order?', a: 'Once shipped, you\'ll receive a tracking link via email and SMS with real-time updates.' },
  { q: 'Can I cancel my order?', a: 'Orders can be cancelled within 2 hours of placement. Contact support immediately for help.' },
];

const Support = () => {
  const [activeQ, setActiveQ] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="support-page page-transition">
      <div className="support-hero">
        <div className="support-hero-glow" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h1 className="support-hero__title">How can we help?</h1>
          <p className="support-hero__sub">Our team is available Mon–Sat, 9 AM – 8 PM IST</p>
        </div>
      </div>

      <div className="container support-grid">
        {/* Contact Cards */}
        <div className="contact-cards">
          {[
            { icon: <FiPhoneCall size={36} />, title: 'Call Us', info: '+91 807 843 0033', sub: 'Mon-Sat: 9AM – 8PM', borderTop: '2px solid #ff3c3c', id: 'call' },
            { icon: <FiMail size={36} />, title: 'Email Us', info: 'support@nexusstore.in', sub: 'Reply within 24hrs', borderTop: '2px solid #ff6b00', id: 'email' },
            { icon: <FiMessageCircle size={36} />, title: 'Live Chat', info: 'Chat with an agent', sub: 'Avg. wait: 2 mins', borderTop: '2px solid #ffffff', id: 'chat' },
          ].map((c, i) => (
            <div key={i} className="contact-card" style={{ borderTop: c.borderTop }} id={`contact-${c.id}`}>
              <div className="contact-card__icon" style={{ color: c.borderTop.split(' ')[2] }}>{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.info}</p>
              <span>{c.sub}</span>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="faq-section">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`faq-item ${activeQ === i ? 'faq-item--open' : ''}`}
            >
              <button
                className="faq-q"
                onClick={() => setActiveQ(activeQ === i ? null : i)}
                id={`faq-${i}`}
              >
                <span>{faq.q}</span>
                <span className={`faq-arrow ${activeQ === i ? 'faq-arrow--open' : ''}`}>+</span>
              </button>
              <div className="faq-answer-wrap">
                <p className="faq-a">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="support-form glass-card">
          <h2 className="form-title">Send a Message</h2>
          {sent && <div className="form-success">✓ Message sent! We'll get back to you within 24 hours.</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input className="form-input" placeholder="Your Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required id="support-name" />
              <input className="form-input" type="email" placeholder="Email Address" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required id="support-email" />
            </div>
            <input className="form-input" placeholder="Subject" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required id="support-subject" />
            <textarea className="form-textarea" placeholder="Describe your issue..." rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})} required id="support-message" />
            <button type="submit" className="form-submit" id="support-submit-btn">
              <FiSend size={16} /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Support;
