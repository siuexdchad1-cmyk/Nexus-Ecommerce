import React from 'react';
import { useLocation } from 'react-router-dom';
import PillNav from './PillNav';

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Brands', href: '/brands' },
    { label: 'Support', href: '/support' },
    { label: 'Orders', href: '/orders' }
  ];

  return (
    <PillNav
      items={navLinks}
      activeHref={location.pathname}
      className="custom-nav"
      ease="power3.easeOut"
      baseColor="#111111"
      pillColor="#1a1a1a"
      hoveredPillTextColor="#000000"
      pillTextColor="#ffffff"
    />
  );
};

export default Navbar;
