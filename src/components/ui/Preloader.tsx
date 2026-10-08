import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import logoFooter from '../../assets/logo-footer.png';

export const Preloader: React.FC = () => {
  const [isMounted, setIsMounted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Unmount the preloader after a short delay
        setTimeout(() => setIsMounted(false), 200);
      }
    });

    // 1. Expanding Circular Mask & Focus
    tl.fromTo(logoWrapperRef.current, 
      { 
        clipPath: 'circle(0% at 50% 40%)', 
        scale: 0.85, 
        filter: 'blur(12px)' 
      },
      { 
        clipPath: 'circle(150% at 50% 40%)', 
        scale: 1, 
        filter: 'blur(0px)', 
        duration: 1.6, 
        ease: "power2.inOut" 
      }
    );

    // 2. Light Sweep (Shimmer) over the gold
    tl.fromTo(shimmerRef.current,
      { x: '-150%', opacity: 0 },
      { x: '200%', opacity: 0.6, duration: 1.2, ease: "power1.inOut" },
      "-=1.0" // Start while the circle is still expanding
    ).to(shimmerRef.current, { opacity: 0, duration: 0.2 }, "-=0.2");

    // 3. Float up slightly for an elegant exit
    tl.to(logoWrapperRef.current, {
      y: -20,
      duration: 0.6,
      ease: "power2.inOut"
    }, "-=0.3");

    // 4. Slide Up Entire Screen Container
    tl.to(containerRef.current, {
      yPercent: -100,
      opacity: 0,
      duration: 0.8,
      ease: "power3.inOut",
    }, "+=0.1");

  }, { scope: containerRef });

  if (!isMounted) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div 
        ref={logoWrapperRef}
        className="relative flex items-center justify-center overflow-hidden" 
        style={{ padding: '1rem', borderRadius: '1rem' }} 
      >
        <img 
          src={logoFooter} 
          alt="New Star Real Estate" 
          style={{ 
            height: '240px', 
            width: 'auto', 
            maxWidth: '90vw',
            objectFit: 'contain' 
          }} 
        />
        
        {/* Shimmer / Light Sweep Element */}
        <div 
          ref={shimmerRef}
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)',
            transform: 'skewX(-25deg)',
            width: '60%',
            left: '0'
          }}
        />
      </div>
    </div>
  );
};
