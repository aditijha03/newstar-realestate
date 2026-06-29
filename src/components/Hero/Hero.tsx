import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from "lucide-react";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { prefersReducedMotion, useGsapHeroTimeline, useGsapMagneticHover } from '@/utils/animations';

const SplitText: React.FC<{ text: string, type?: 'letter' | 'word', className?: string }> = ({ text, type = 'letter', className = '' }) => {
  if (type === 'letter') {
    return (
      <span aria-label={text} className={className}>
        {text.split(' ').map((word, wordIndex, wordArr) => (
          <span key={wordIndex} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            {word.split('').map((char, charIndex) => (
              <span key={charIndex} className="hero-letter inline-block" aria-hidden="true">
                <span className="hero-letter-inner inline-block">{char}</span>
              </span>
            ))}
            {wordIndex !== wordArr.length - 1 && (
              <span className="hero-letter inline-block" aria-hidden="true" style={{ whiteSpace: 'pre' }}>
                <span className="hero-letter-inner inline-block">{' '}</span>
              </span>
            )}
          </span>
        ))}
      </span>
    );
  }
  return (
    <span aria-label={text} className={className}>
      {text.split(' ').map((word, index, arr) => (
        <span key={index} className="hero-word inline-block" aria-hidden="true" style={{ whiteSpace: 'pre-wrap' }}>
          <span className="hero-word-inner inline-block">
            {word}{index !== arr.length - 1 ? ' ' : ''}
          </span>
        </span>
      ))}
    </span>
  );
};

export const Hero: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);

  // Apply the coordinated entry sequence
  useGsapHeroTimeline(containerRef);
  
  // Apply magnetic hover to buttons
  useGsapMagneticHover(containerRef, '.magnetic-btn');

  useGSAP(() => {
    if (prefersReducedMotion()) return;

    // Parallax effect for the background on scroll
    gsap.to(bgRef.current, {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    // Subtle gradient animation
    gsap.to(gradientRef.current, {
      backgroundImage: 'linear-gradient(45deg, rgba(201,168,76,0.1) 0%, rgba(11,17,32,0.1) 100%)',
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: 'linear'
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative flex items-center overflow-hidden min-h-[50vh] sm:min-h-[55vh] md:min-h-[65vh] lg:min-h-[75vh] mt-[3.5rem] lg:mt-0 pb-16">
      {/* Background */}
      <div ref={bgRef} className="absolute inset-0 hero-bg" style={{ zIndex: 0, height: '130%', top: '-15%' }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/hero-bg1.jpg"
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Responsive dark overlay */}
        <div
          className="absolute inset-0 hero-overlay"
          aria-hidden="true"
        />

        {/* Animated gradient overlay */}
        <div
          ref={gradientRef}
          className="absolute inset-0"
          style={{ 
            mixBlendMode: 'overlay',
            backgroundImage: 'linear-gradient(45deg, rgba(11,17,32,0.1) 0%, rgba(201,168,76,0.1) 100%)'
          }}
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div
        className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-16 sm:pt-32 sm:pb-24 md:pt-32 md:pb-20 lg:pt-[10rem] lg:pb-[5rem] flex flex-col justify-center"
        style={{ zIndex: 10 }}
      >
        <div className="max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-2xl">
          {/* Welcome label */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E6C97A] animate-pulse" />
            <span className="hero-label">
              <SplitText text="VERIFIED PROPERTY LISTINGS" type="letter" />
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-extrabold hero-heading">
            <span style={{ whiteSpace: 'nowrap' }}>
              <SplitText text="Resale Flats," type="word" className="hero-heading-word" />
            </span>
            <br />
            <span style={{ whiteSpace: 'nowrap' }}>
              <SplitText text="Villas & Farmhouses" type="word" className="hero-heading-word" />
            </span>
          </h1>

          {/* Gold bar */}
          <div className="hero-anim hero-gold-bar" aria-hidden="true" />

          {/* Subtitle */}
          <p className="hero-subtitle">
            <SplitText type="word" text="Discover premium properties across Panvel, Navi Mumbai, Lonavala and Karjat with expert guidance and site visit assistance." className="hero-subtitle-word" />
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="hero-anim flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={() => navigate('/properties')}
            onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, boxShadow: "0 10px 30px rgba(201,168,76,0.3)", duration: 0.3 })}
            onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, boxShadow: "none", duration: 0.3 })}
            onMouseDown={(e) => gsap.to(e.currentTarget, { scale: 0.95, duration: 0.1 })}
            onMouseUp={(e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.1 })}
            className="px-8 py-4 rounded-xl font-semibold text-black transition-colors duration-300 btn-gold magnetic-btn"
          >
            <span className="magnetic-content inline-block">View Properties</span>
          </button>

          <button
            onClick={() => navigate('/contact')}
            onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.6)", duration: 0.3 })}
            onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, backgroundColor: "transparent", borderColor: "rgba(255,255,255,0.2)", duration: 0.3 })}
            onMouseDown={(e) => gsap.to(e.currentTarget, { scale: 0.95, duration: 0.1 })}
            onMouseUp={(e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.1 })}
            className="px-8 py-4 rounded-xl font-semibold text-white border border-white/20 backdrop-blur-md transition-colors duration-300 magnetic-btn"
          >
            <span className="magnetic-content inline-block">Schedule Site Visit</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-4 mt-6 text-sm text-white/90">
          <SplitText type="word" text="✓ Verified Listings" />
          <SplitText type="word" text="✓ Site Visit Assistance" />
          <SplitText type="word" text="✓ Documentation Support" />
        </div>

        <div className="flex flex-wrap gap-4 mt-6">
          {['Hiranandani', 'Godrej City', 'Wadhwa', 'Arhihant'].map((location) => (
            <span
              key={location}
              className="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-white text-sm backdrop-blur-md flex items-center gap-1"
            >
              <span aria-hidden="true">📍</span>
              <SplitText type="letter" text={location} />
            </span>
          ))}
        </div>
      </div>

    </section>
  );
};