import React from 'react';
import { FiTruck, FiShoppingBag, FiTool, FiShield, FiAward } from 'react-icons/fi';
import './FeaturesStrip.css';

const features = [
  { icon: <FiTruck size={28} style={{ color: '#ff3c3c' }} />, title: 'Free Delivery', sub: 'Free delivery over ₹999 orders' },
  { icon: <FiShoppingBag size={28} style={{ color: '#ff6b00' }} />, title: 'Easy Shop', sub: 'Effortless shopping experience' },
  { icon: <FiTool size={28} style={{ color: '#ff3c3c' }} />, title: 'Repair 24/7', sub: 'We fix all electronics' },
  { icon: <FiShield size={28} style={{ color: '#ff6b00' }} />, title: 'Money Back', sub: '30 days return guarantee' },
  { icon: <FiAward size={28} style={{ color: '#ff3c3c' }} />, title: 'Member Discount', sub: 'Members save up to ₹500' },
];

const FeaturesStrip = () => {
  return (
    <div className="features-strip">
      <div className="container features-inner">
        {features.map((f, i) => (
          <React.Fragment key={i}>
            <div className="feature-item">
              <span className="feature-icon">{f.icon}</span>
              <div>
                <p className="feature-title">{f.title}</p>
                <p className="feature-sub">{f.sub}</p>
              </div>
            </div>
            {i < features.length - 1 && <div className="feature-divider" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default FeaturesStrip;
