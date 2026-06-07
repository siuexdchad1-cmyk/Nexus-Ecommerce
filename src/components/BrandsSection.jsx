import React from 'react';
import { Link } from 'react-router-dom';
import { FaApple } from 'react-icons/fa';
import { 
  SiSamsung, 
  SiSony, 
  SiAsus, 
  SiDell, 
  SiRazer, 
  SiLogitech, 
  SiHp, 
  SiLenovo, 
  SiXiaomi 
} from 'react-icons/si';
import './BrandsSection.css';

const brandsList = [
  { name: 'Apple', icon: <FaApple />, color: '#ffffff' },
  { name: 'Samsung', icon: <SiSamsung />, color: '#1428A0' },
  { name: 'Sony', icon: <SiSony />, color: '#ffffff' },
  { name: 'ASUS', icon: <SiAsus />, color: '#ffffff' },
  { name: 'Dell', icon: <SiDell />, color: '#007DB8' },
  { name: 'Razer', icon: <SiRazer />, color: '#44D62C' },
  { name: 'Logitech', icon: <SiLogitech />, color: '#ffffff' },
  { name: 'HP', icon: <SiHp />, color: '#0096D6' },
  { name: 'Lenovo', icon: <SiLenovo />, color: '#E2231A' },
  { name: 'Xiaomi', icon: <SiXiaomi />, color: '#FF6900' },
];

const BrandsSection = () => (
  <section className="brands-section section-padding">
    <div className="container">
      <div className="section-header">
        <h2 className="section-title">Shop by Brand</h2>
        <Link to="/brands" className="btn-primary" style={{ fontSize: '13px', padding: '8px 20px' }}>
          All Brands →
        </Link>
      </div>
      <div className="brands-grid">
        {brandsList.map(brand => (
          <Link
            key={brand.name}
            to={`/shop?brand=${brand.name}`}
            className="brand-item"
            id={`brand-${brand.name.toLowerCase()}`}
          >
            <span className="brand-emoji" style={{ color: brand.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {brand.icon}
            </span>
            <span className="brand-name">{brand.name}</span>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default BrandsSection;
