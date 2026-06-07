import React from 'react';
import { Link } from 'react-router-dom';
import { FaApple } from 'react-icons/fa';
import {
  SiSamsung, SiSony, SiAsus, SiDell, SiRazer, SiLogitech,
  SiHp, SiLenovo, SiXiaomi, SiOneplus, SiBose
} from 'react-icons/si';
import './Brands.css';

const brandsList = [
  { name: 'Apple',    icon: <FaApple size={28} />,    bg: '#000000', color: '#ffffff', founded: '1976', country: 'USA',         desc: 'Makers of iPhone, Mac, iPad, Apple Watch and AirPods.', count: 12 },
  { name: 'Samsung',  icon: <SiSamsung size={28} />,  bg: '#1428A0', color: '#ffffff', founded: '1969', country: 'South Korea', desc: 'Global leader in smartphones, tablets and displays.', count: 15 },
  { name: 'Sony',     icon: <SiSony size={28} />,     bg: '#000000', color: '#ffffff', founded: '1946', country: 'Japan',       desc: 'Premium electronics including PlayStation, cameras and headphones.', count: 10 },
  { name: 'ASUS',     icon: <SiAsus size={28} />,     bg: '#CC0000', color: '#ffffff', founded: '1989', country: 'Taiwan',      desc: 'ROG gaming laptops, monitors, motherboards and accessories.', count: 8 },
  { name: 'Dell',     icon: <SiDell size={28} />,     bg: '#007DB8', color: '#ffffff', founded: '1984', country: 'USA',         desc: 'XPS, Alienware and Inspiron laptops and workstations.', count: 6 },
  { name: 'Razer',    icon: <SiRazer size={28} />,    bg: '#00D100', color: '#000000', founded: '2005', country: 'Singapore',   desc: 'High-performance gaming mice, keyboards and headsets.', count: 8 },
  { name: 'Logitech', icon: <SiLogitech size={28} />, bg: '#00B5AD', color: '#ffffff', founded: '1981', country: 'Switzerland', desc: 'Pro-grade mice, keyboards and webcams for creators.', count: 7 },
  { name: 'HP',       icon: <SiHp size={28} />,       bg: '#0096D6', color: '#ffffff', founded: '1939', country: 'USA',         desc: 'Spectre, Omen and Pavilion laptops and printers.', count: 7 },
  { name: 'Lenovo',   icon: <SiLenovo size={28} />,   bg: '#E2231A', color: '#ffffff', founded: '1984', country: 'China',       desc: 'Legion gaming, ThinkPad business and IdeaPad consumer laptops.', count: 6 },
  { name: 'Xiaomi',   icon: <SiXiaomi size={28} />,   bg: '#FF6900', color: '#ffffff', founded: '2010', country: 'China',       desc: 'Affordable smartphones, smart home and wearables.', count: 6 },
  { name: 'OnePlus',  icon: <SiOneplus size={28} />,  bg: '#F5010C', color: '#ffffff', founded: '2013', country: 'China',       desc: 'Flagship killer smartphones with fast charging.', count: 4 },
  { name: 'Bose',     icon: <SiBose size={28} />,     bg: '#1A1A1A', color: '#ffffff', founded: '1964', country: 'USA',         desc: 'Premium audio: headphones, speakers and soundbars.', count: 4 },
];

const Brands = () => (
  <div className="brands-page page-transition">
    <div className="brands-hero">
      <div className="brands-hero-glow" />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <h1 className="brands-hero__title">Shop by Brand</h1>
        <p className="brands-hero__sub">Explore products from the world's leading electronics brands</p>
      </div>
    </div>
    <div className="container brands-grid-main">
      {brandsList.map(brand => (
        <Link
          key={brand.name}
          to={`/shop?brand=${brand.name}`}
          className="brand-card"
          id={`brand-page-${brand.name.toLowerCase()}`}
        >
          {/* Brand Logo Avatar */}
          <div
            className="brand-avatar"
            style={{ background: brand.bg, color: brand.color }}
          >
            {brand.icon}
          </div>
          <div className="brand-card__info">
            <h3 className="brand-card__name">{brand.name}</h3>
            <p className="brand-card__meta">{brand.country} · Since {brand.founded}</p>
            <p className="brand-card__desc">{brand.desc}</p>
            <span className="brand-card__count">{brand.count} Products →</span>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

export default Brands;
