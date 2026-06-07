import React, { useState, useEffect } from 'react';

const BackgroundBlobs = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(hasTouchScreen || isSmallScreen);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) return null;

  return (
    <>
      {/* Blob 1 — top right */}
      <div
        style={{
          position: 'fixed',
          zIndex: 0,
          pointerEvents: 'none',
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(255,60,60,0.08) 0%, transparent 70%)',
          top: '-150px',
          right: '-150px',
          borderRadius: '50%',
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}
      />
      {/* Blob 2 — bottom left */}
      <div
        style={{
          position: 'fixed',
          zIndex: 0,
          pointerEvents: 'none',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(255,107,0,0.07) 0%, transparent 70%)',
          bottom: '-150px',
          left: '-150px',
          borderRadius: '50%',
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}
      />
      {/* Blob 3 — center */}
      <div
        style={{
          position: 'fixed',
          zIndex: 0,
          pointerEvents: 'none',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(255,60,60,0.04) 0%, transparent 60%)',
          top: '40%',
          left: '50%',
          borderRadius: '50%',
          willChange: 'transform',
          transform: 'translate(-50%, -50%) translateZ(0)',
        }}
      />
    </>
  );
};

export default BackgroundBlobs;
