import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const GOLD = '#C9A84C';

export const Preloader: React.FC = () => {
  const [isMounted, setIsMounted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const starRef = useRef<SVGPolygonElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Unmount the preloader after a short delay
        setTimeout(() => setIsMounted(false), 200);
      }
    });

    // 1. Draw Star
    tl.fromTo(starRef.current, 
      { strokeDasharray: "100%", strokeDashoffset: "100%", fill: "rgba(201,168,76,0)" },
      { strokeDashoffset: "0%", duration: 1.2, ease: "power2.inOut" }
    ).to(starRef.current, {
      fill: "rgba(201,168,76,1)", duration: 0.6, ease: "power2.in"
    }, "-=0.3");

    // 2. Reveal Letters
    if (titleContainerRef.current) {
      const letters = titleContainerRef.current.querySelectorAll('.letter');
      tl.fromTo(letters, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1 },
        "-=0.6"
      );
    }

    // 3. Reveal Subtitle
    tl.fromTo(subtitleRef.current,
      { opacity: 0, y: 10, filter: 'blur(8px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: "power2.out" },
      "-=0.4"
    );

    // 4. Slide Up Container
    tl.to(containerRef.current, {
      yPercent: -100,
      opacity: 0,
      duration: 0.9,
      ease: "power3.inOut",
      delay: 0.5
    });

  }, { scope: containerRef });

  const title = "NEW STAR".split('');

  if (!isMounted) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="flex flex-col items-center justify-center">
        
        {/* The Drawing Star */}
        <svg
          width="56"
          height="56"
          viewBox="0 0 24 24"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: 'drop-shadow(0 4px 15px rgba(201,168,76,0.3))' }}
        >
          <polygon
            ref={starRef}
            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
            stroke={GOLD}
            strokeWidth="1.2"
          />
        </svg>

        {/* The Cinematic Text Reveal */}
        <div className="flex flex-col items-center leading-none mt-6">
          <div
            ref={titleContainerRef}
            className="flex overflow-hidden pb-2"
          >
            {title.map((char, index) => (
              <span
                key={index}
                className="letter"
                style={{ 
                  color: 'var(--text-primary)',
                  fontFamily: '"Playfair Display", serif', 
                  fontWeight: 700, 
                  fontSize: '2.5rem', 
                  letterSpacing: '0.15em',
                  marginRight: char === ' ' ? '0.5rem' : '0'
                }}
              >
                {char === ' ' ? '' : char}
              </span>
            ))}
          </div>

          <span 
            ref={subtitleRef}
            style={{ 
              color: GOLD, 
              fontFamily: 'Inter, sans-serif', 
              fontSize: '0.85rem', 
              fontWeight: 600, 
              letterSpacing: '0.3em', 
              textTransform: 'uppercase', 
              marginTop: '0.25rem' 
            }}
          >
            Real Estate
          </span>
        </div>
      </div>
    </div>
  );
};
