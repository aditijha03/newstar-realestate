import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Defined coordinates matching exactly the endpoints of the SVG curve
const LOCATIONS = [
  { name: 'Our Coverage', top: 4, left: 92, isTitle: true },
  { name: 'Lonavala', top: 15, left: 80 },
  { name: 'Khopoli', top: 25, left: 85 },
  { name: 'Hiranandani Estate', top: 35, left: 40 },
  { name: 'Karjat', top: 45, left: 15 },
  { name: 'Chowk', top: 55, left: 10 },
  { name: 'Mumbai 3.0', top: 65, left: 60 },
  { name: 'Godrej City', top: 73, left: 85 },
  { name: 'Panvel', top: 80, left: 90 },
  { name: 'Uran', top: 87, left: 70 },
  { name: 'Ulwe', top: 93, left: 5 },
  { name: 'Navi Mumbai', top: 97.5, left: 50, isPremium: true },
];

export const HomePageScrollLine: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const clipRectRef = useRef<SVGRectElement>(null);
  const markerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!clipRectRef.current || !containerRef.current) return;

    // Keep track of which markers have already popped
    const poppedState = new Array(LOCATIONS.length).fill(false);

    // 1. The title fades in on page load immediately
    const titleMarker = markerRefs.current[0];
    if (titleMarker) {
      gsap.fromTo(titleMarker,
        { opacity: 0, y: -20, scale: 1 },
        { opacity: 1, y: 0, scale: 1, ease: 'power3.out', duration: 1, delay: 0.5 }
      );
      poppedState[0] = true;
    }

    // Master timeline mapped exactly to the scroll of the main content container, NOT the whole body, 
    // so the footer height doesn't break the synchronization math!
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true, // TRUE means ZERO smoothing. It is locked 1:1 to your exact scroll pixels.
        onUpdate: (self) => {
          const p = self.progress;

          // Check each marker against the current scroll progress of the line
          markerRefs.current.forEach((marker, index) => {
            if (!marker || LOCATIONS[index].isTitle) return;
            
            const loc = LOCATIONS[index];
            const exactTriggerProgress = Math.max(0, (loc.top * 10 - 60) / 940);
            const hideTriggerProgress = Math.max(0, exactTriggerProgress - 0.001); // Tiny buffer just to prevent flickering, but functionally instant

            if (p >= exactTriggerProgress && !poppedState[index]) {
              poppedState[index] = true;
              gsap.fromTo(marker,
                { scale: 0, opacity: 0, y: 30 },
                { scale: 1, opacity: 1, y: 0, ease: 'back.out(2)', duration: 0.6, overwrite: 'auto' }
              );
            } else if (p < hideTriggerProgress && poppedState[index]) {
              poppedState[index] = false;
              gsap.to(marker, { scale: 0, opacity: 0, y: 0, duration: 0, overwrite: 'auto' }); // 0s duration for instant vanish
            }
          });
        }
      }
    });

    // Animate the line drawing down the page
    tl.fromTo(clipRectRef.current, 
      { attr: { height: 60 } },
      { attr: { height: 1000 }, ease: 'none', duration: 1 },
      0 // Start at time 0
    );

    // Refresh ScrollTrigger when lazy-loaded sections expand the DOM
    const resizeObserver = new ResizeObserver(() => {
      ScrollTrigger.refresh();
    });
    resizeObserver.observe(document.body);

    return () => {
      resizeObserver.disconnect();
      tl.kill();
    };

  }, { scope: containerRef });

  return (
    <div 
      ref={containerRef} 
      className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1600px] h-full pointer-events-none overflow-visible" 
      style={{ zIndex: 49 }}
    >
      {/* Background SVG Canvas */}
      <svg 
        className="absolute top-0 left-0 w-full h-full"
        viewBox="0 0 100 1000" 
        preserveAspectRatio="none"
        fill="none"
        style={{ opacity: 0.8 }}
      >
        <defs>
          <clipPath id="scrollLineClip">
            <rect ref={clipRectRef} x="0" y="0" width="100" height="0" />
          </clipPath>
          
          <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C9A84C" stopOpacity="0" />
            <stop offset="5%" stopColor="#C9A84C" stopOpacity="1" />
            <stop offset="50%" stopColor="#E6C97A" stopOpacity="1" />
            <stop offset="95%" stopColor="#C9A84C" stopOpacity="1" />
            <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* The solid gold route trace (animated by clipPath) */}
        <path
          d="
            M 85 40
            C 85 80, 80 150, 80 150
            C 80 200, 85 250, 85 250
            C 85 300, 40 350, 40 350
            C 40 400, 15 450, 15 450
            C 15 500, 10 550, 10 550
            C 10 600, 60 650, 60 650
            C 60 690, 85 730, 85 730
            C 85 765, 90 800, 90 800
            C 90 835, 70 870, 70 870
            C 70 900, 5 930, 5 930
            C 5 952, 50 975, 50 975
            C 50 987, 50 1000, 50 1000
          "
          stroke="url(#goldGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="14 10"
          vectorEffect="non-scaling-stroke"
          clipPath="url(#scrollLineClip)"
        />
        
        {/* Subtle glowing trail underneath the line */}
        <path
          d="
            M 85 40
            C 85 80, 80 150, 80 150
            C 80 200, 85 250, 85 250
            C 85 300, 40 350, 40 350
            C 40 400, 15 450, 15 450
            C 15 500, 10 550, 10 550
            C 10 600, 60 650, 60 650
            C 60 690, 85 730, 85 730
            C 85 765, 90 800, 90 800
            C 90 835, 70 870, 70 870
            C 70 900, 5 930, 5 930
            C 5 952, 50 975, 50 975
            C 50 987, 50 1000, 50 1000
          "
          stroke="url(#goldGradient)"
          strokeWidth="10"
          opacity="0.3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          clipPath="url(#scrollLineClip)"
          style={{ filter: 'blur(5px)' }}
        />
      </svg>

      {/* Scattered DOM Markers */}
      {LOCATIONS.map((loc, idx) => (
        <div
          key={loc.name}
          ref={(el) => { markerRefs.current[idx] = el; }}
          className="absolute pointer-events-auto"
          style={{ top: `${loc.top}%`, left: `${loc.left}%`, opacity: 0 }}
        >
          {loc.isTitle ? (
            <div className={`absolute whitespace-nowrap -translate-y-1/2 ${loc.left >= 80 ? 'right-0 pr-2 sm:pr-4' : loc.left <= 20 ? 'left-0 pl-2 sm:pl-4' : '-translate-x-1/2'}`}>
              <span className="text-[#E6C97A] text-xs sm:text-base uppercase tracking-[0.15em] sm:tracking-[0.25em] font-bold" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                {loc.name}
              </span>
            </div>
          ) : (
            <div className="relative">
              {/* The Dot - Perfectly centered exactly on the SVG line */}
              <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 z-10">
                {loc.isPremium ? (
                   <span className="block w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-white animate-pulse shadow-[0_0_15px_#fff]" />
                ) : (
                   <span className="block w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#FFD977] shadow-[0_0_12px_#FFD977]" />
                )}
              </div>
              
              {/* The Text Box - Positioned safely inward from the dot so it never clips on mobile edges */}
              <div className={`absolute -translate-y-1/2 whitespace-nowrap ${loc.left >= 80 ? 'right-0 pr-4 sm:pr-6' : loc.left <= 20 ? 'left-0 pl-4 sm:pl-6' : '-translate-x-1/2 top-8 sm:top-10'}`}>
                <div 
                  className={`px-4 py-2 sm:px-6 sm:py-3.5 rounded-xl sm:rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.5)] cursor-pointer hover:scale-105 duration-300 ${loc.isPremium ? 'border-2' : 'bg-black/80 backdrop-blur-xl border border-[#E6C97A]/40 hover:bg-black transition-colors'}`}
                  style={loc.isPremium ? {
                    background: "linear-gradient(135deg, rgba(201,168,76,0.95), rgba(11,17,32,0.98))",
                    borderColor: "rgba(201,168,76,0.9)",
                  } : {}}
                >
                  <span className={`text-white font-bold tracking-wide ${loc.isPremium ? 'text-sm sm:text-lg' : 'text-xs sm:text-base'}`}>
                    {loc.name}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
