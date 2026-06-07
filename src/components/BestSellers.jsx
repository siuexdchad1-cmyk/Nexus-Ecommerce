import React, { useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProductCard from './ProductCard';
import { getBestSellers } from '../data/products';
import './BestSellers.css';

const bestSellers = getBestSellers();

const BestSellers = () => {
  const row1 = bestSellers.slice(0, 4);
  const row2 = bestSellers.slice(4, 8);

  return (
    <section className="best-sellers section-padding">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Best Sellers</h2>
          <div className="scroll-arrows">
            <button className="scroll-arrow" aria-label="Previous" id="bestsellers-prev">
              <FiChevronLeft size={18} />
            </button>
            <button className="scroll-arrow" aria-label="Next" id="bestsellers-next">
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>
        <div className="bs-grid-row">
          {row1.map((product, i) => (
            <div key={product.id} className="animate" style={{ transitionDelay: `${i * 80}ms` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        <div className="bs-grid-row" style={{ marginTop: '16px' }}>
          {row2.map((product, i) => (
            <div key={product.id} className="animate" style={{ transitionDelay: `${(i + 4) * 80}ms` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
