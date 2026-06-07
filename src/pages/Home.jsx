import React, { useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import FeaturesStrip from '../components/FeaturesStrip';
import NewProducts from '../components/NewProducts';
import DealsOfDay from '../components/DealsOfDay';
import BestSellers from '../components/BestSellers';
import BrandsSection from '../components/BrandsSection';
import Testimonials from '../components/Testimonials';
import MagicBento from '../components/MagicBento';

const Home = () => {
  useEffect(() => {
    // Intersection observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.animate').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="page-transition">
      <HeroBanner />
      <FeaturesStrip />
      <NewProducts />
      
      {/* Nexus Difference Bento Section */}
      <section className="container animate" style={{ margin: '60px auto' }}>
        <div className="section-header" style={{ marginBottom: '24px' }}>
          <h2 className="section-title">THE NEXUS DIFFERENCE</h2>
        </div>
        <MagicBento 
          textAutoHide={true}
          enableStars={true}
          enableSpotlight={true}
          enableBorderGlow={true}
          enableTilt={true}
          enableMagnetism={true}
          clickEffect={true}
          spotlightRadius={300}
          particleCount={12}
          glowColor="255, 60, 60"
        />
      </section>

      <DealsOfDay />
      <BestSellers />
      <BrandsSection />
      <Testimonials />
    </main>
  );
};

export default Home;
