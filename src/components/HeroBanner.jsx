import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import TiltedCard from './TiltedCard';
import './HeroBanner.css';

const slides = [
  {
    id: 1,
    tag: 'SPECIAL OFFER',
    headline1: 'FLAT 25% OFF',
    headline2: 'VIRTUAL REALITY',
    sub: 'From $129.99',
    cta: 'Shop Now',
    ctaLink: '/shop?category=Gaming',
    image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=600&q=80',
    bgGlow: 'rgba(255,60,60,0.25)',
  },
  {
    id: 2,
    tag: 'NEW ARRIVAL',
    headline1: 'NEXT-GEN',
    headline2: 'SMARTPHONES',
    sub: 'From $299.99',
    cta: 'Explore Now',
    ctaLink: '/shop?category=Smartphones',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80',
    bgGlow: 'rgba(255,107,0,0.2)',
  },
  {
    id: 3,
    tag: 'GAMING WEEK',
    headline1: 'DOMINATE',
    headline2: 'EVERY GAME',
    sub: 'Gear from $59.99',
    cta: 'Shop Gaming',
    ctaLink: '/shop?category=Gaming',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80',
    bgGlow: 'rgba(255,60,60,0.3)',
  },
];

const featuredCards = [
  {
    tag: 'CPU BOOST',
    name: 'Gaming Laptop',
    sub: 'From $899',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300&q=80',
    link: '/shop?category=Laptops',
  },
  {
    tag: 'NEW LAUNCH',
    name: 'Premium Headphones',
    sub: 'From $99',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80',
    link: '/shop?category=Headphones',
  },
  {
    tag: '4K DISPLAY',
    name: 'Vega Monitor',
    sub: 'From $599',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&q=80',
    link: '/shop?category=Accessories',
  },
];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef(null);

  const goTo = (idx) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent(idx);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const next = () => goTo((current + 1) % slides.length);
  const prev = () => goTo((current - 1 + slides.length) % slides.length);

  useEffect(() => {
    timerRef.current = setInterval(next, 5000);
    return () => clearInterval(timerRef.current);
  }, [current]);

  const slide = slides[current];

  return (
    <section className="hero-section">
      {/* Main Banner */}
      <div className="hero-banner">
        <div
          className="hero-glow"
          style={{ background: `radial-gradient(circle at 70% 50%, ${slide.bgGlow}, transparent 70%)` }}
        />
        <div className="container hero-inner">
          {/* Left Content */}
          <div className={`hero-content ${isAnimating ? 'hero-content--exit' : 'hero-content--enter'}`}>
            <span className="hero-tag">{slide.tag}</span>
            <h1 className="hero-headline">
              <span className="hero-h1">{slide.headline1}</span>
              <span className="hero-h2">{slide.headline2}</span>
            </h1>
            <p className="hero-sub">{slide.sub}</p>
            <Link to={slide.ctaLink} className="hero-cta" id={`hero-cta-${slide.id}`}>
              {slide.cta} →
            </Link>
          </div>

          {/* Right Image */}
          <div className={`hero-img-wrap ${isAnimating ? 'hero-img--exit' : 'hero-img--enter'}`} style={{ background: 'none' }}>
            <TiltedCard
              imageSrc={slide.image}
              altText={slide.headline2}
              captionText={slide.headline2}
              containerHeight="100%"
              containerWidth="100%"
              imageHeight="100%"
              imageWidth="100%"
              scaleOnHover={1.05}
              rotateAmplitude={12}
              showMobileWarning={false}
              showTooltip={true}
            />
          </div>

          {/* Arrows */}
          <button className="hero-arrow hero-arrow--left" onClick={prev} aria-label="Previous slide">
            <FiChevronLeft size={20} />
          </button>
          <button className="hero-arrow hero-arrow--right" onClick={next} aria-label="Next slide">
            <FiChevronRight size={20} />
          </button>
        </div>

        {/* Dots */}
        <div className="hero-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`hero-dot ${i === current ? 'hero-dot--active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Featured Cards */}
      <div className="container featured-cards">
        {featuredCards.map((card, i) => (
          <Link to={card.link} key={i} className="featured-card" id={`featured-card-${i}`}>
            <div className="featured-card__info">
              <span className="featured-card__tag">{card.tag}</span>
              <h3 className="featured-card__name">{card.name}</h3>
              <p className="featured-card__sub">{card.sub}</p>
              <span className="featured-card__cta">Shop Now →</span>
            </div>
            <div className="featured-card__img-wrap" style={{ padding: 0 }}>
              <TiltedCard
                imageSrc={card.image}
                altText={card.name}
                captionText={card.name}
                containerHeight="100px"
                containerWidth="120px"
                imageHeight="100px"
                imageWidth="120px"
                scaleOnHover={1.08}
                rotateAmplitude={10}
                showMobileWarning={false}
                showTooltip={false}
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default HeroBanner;
