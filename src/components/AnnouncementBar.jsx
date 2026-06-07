import React from 'react';
import { FiTruck, FiZap, FiGift, FiTarget } from 'react-icons/fi';
import './AnnouncementBar.css';

const AnnouncementBar = () => {
  return (
    <div className="announcement-bar">
      <div className="ann-left">
        <FiTruck size={12} className="ann-icon" />
        <span>Free Delivery over <span className="highlight">₹999</span></span>
        <span className="ann-sep">•</span>
        <span>Fulfilled by Amazon</span>
      </div>
      <div className="ann-center">
        <div className="marquee-track">
          <span>
            <FiZap size={12} className="ann-icon" />
            Flat <span className="highlight">25% OFF</span> on all orders above ₹499
            <span className="ann-sep">•</span>
            Code: <strong className="highlight">NEXUS25</strong>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <FiZap size={12} className="ann-icon" />
            <span className="highlight">New Arrivals</span> Every Week
            <span className="ann-sep">•</span>
            Free Returns on All Orders
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <FiGift size={12} className="ann-icon" />
            Buy 2 Get 1 <span className="highlight">FREE</span> on Select Accessories
            <span className="ann-sep">•</span>
            Limited Time Only
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <FiZap size={12} className="ann-icon" />
            Flat <span className="highlight">25% OFF</span> on all orders above ₹499
            <span className="ann-sep">•</span>
            Code: <strong className="highlight">NEXUS25</strong>
          </span>
        </div>
      </div>
      <div className="ann-right">
        <FiTarget size={12} className="ann-icon" />
        Huge offers on <span className="highlight">Annual Deal</span>
        <span className="ann-sep">•</span>
        Up to <span className="highlight">40% OFF</span>
      </div>
    </div>
  );
};

export default AnnouncementBar;
