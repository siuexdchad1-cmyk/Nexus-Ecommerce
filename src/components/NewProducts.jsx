import React, { useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProductCard from './ProductCard';
import { getNewProducts } from '../data/products';
import './NewProducts.css';

const newProducts = getNewProducts();

const NewProducts = () => {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 600, behavior: 'smooth' });
    }
  };

  return (
    <section className="new-products section-padding">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">New Products</h2>
          <div className="scroll-arrows">
            <button className="scroll-arrow" onClick={() => scroll(-1)} aria-label="Scroll left" id="new-products-prev">
              <FiChevronLeft size={18} />
            </button>
            <button className="scroll-arrow" onClick={() => scroll(1)} aria-label="Scroll right" id="new-products-next">
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>
        <div className="products-scroll-row" ref={scrollRef}>
          {newProducts.map(product => (
            <ProductCard key={product.id} product={product} compact />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewProducts;
