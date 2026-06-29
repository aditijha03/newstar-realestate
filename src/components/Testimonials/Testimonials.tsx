import React, { useState, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { TESTIMONIALS } from '@/utils/constants';
import gsap from 'gsap';
import { useGsapScrollReveal, useGsapTextScroll } from '@/utils/animations';

const GOLD = '#C9A84C';
const NAVY = '#0B1120';

const StarRating = React.memo(({ rating }: { rating: number }) => (
  <div className="flex gap-0.5" aria-label={`Rating: ${rating} out of 5 stars`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className="w-4 h-4" style={{ color: GOLD, fill: i < rating ? GOLD : 'none' }} aria-hidden="true" />
    ))}
  </div>
));
StarRating.displayName = 'StarRating';

const TestimonialCard = React.memo(({ testimonial, isCenter }: { testimonial: typeof TESTIMONIALS[0]; isCenter?: boolean }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      padding: '1.5rem',
      borderRadius: '1rem',
      background: 'var(--bg-card)',
      border: `1px solid ${isCenter ? 'rgba(201,168,76,0.3)' : 'var(--border-color)'}`,
      boxShadow: isCenter ? '0 12px 40px rgba(0,0,0,0.12)' : '0 4px 24px rgba(0,0,0,0.06)',
      transform: isCenter ? 'scale(1)' : 'scale(0.95)',
      opacity: isCenter ? 1 : 0.8,
      transition: 'all 0.3s',
    }}
  >
    <Quote className="w-8 h-8" style={{ color: GOLD, fill: 'rgba(201,168,76,0.15)' }} aria-hidden="true" />
    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7, flex: 1, transition: 'color 0.2s' }}>{testimonial.review}</p>
    <div className="flex items-center gap-3" style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)', transition: 'border-color 0.2s' }}>
      <img
        src={testimonial.avatar}
        alt={`Photo of ${testimonial.name}`}
        style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: `2px solid rgba(201,168,76,0.3)` }}
        loading="lazy"
        decoding="async"
        width={40}
        height={40}
      />
      <div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem', transition: 'color 0.2s' }}>{testimonial.name}</p>
        <StarRating rating={testimonial.rating} />
      </div>
    </div>
  </div>
));
TestimonialCard.displayName = 'TestimonialCard';

const ArrowBtn = ({ onClick, label, children }: { onClick: () => void; label: string; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    aria-label={label}
    style={{
      width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'var(--bg-card)',
      border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', color: 'var(--text-primary)', transition: 'all 0.2s', flexShrink: 0,
    }}
    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = GOLD; (e.currentTarget as HTMLElement).style.borderColor = GOLD; }}
    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-color)'; }}
  >
    {children}
  </button>
);

export const Testimonials: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(1);
  const [displayIndex, setDisplayIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const total = TESTIMONIALS.length;

  useGsapScrollReveal(sectionRef);
  useGsapTextScroll(sectionRef);

  const changeIndex = useCallback((newIndex: number) => {
    if (newIndex === activeIndex || isAnimating) return;
    setIsAnimating(true);
    setActiveIndex(newIndex); // Update the active indicator immediately

    const targets: HTMLElement[] = [];
    if (desktopContainerRef.current) targets.push(desktopContainerRef.current);
    if (mobileContainerRef.current) targets.push(mobileContainerRef.current);

    gsap.to(targets, {
      opacity: 0,
      scale: 0.95,
      duration: 0.2,
      onComplete: () => {
        setDisplayIndex(newIndex);
        gsap.to(targets, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          clearProps: 'all'
        });
        setIsAnimating(false);
      }
    });
  }, [activeIndex, isAnimating]);

  const prev = useCallback(() => changeIndex((activeIndex - 1 + total) % total), [activeIndex, total, changeIndex]);
  const next = useCallback(() => changeIndex((activeIndex + 1) % total), [activeIndex, total, changeIndex]);

  const visibleIndices = [(displayIndex - 1 + total) % total, displayIndex, (displayIndex + 1) % total];

  return (
    <section ref={sectionRef} className="pt-8 pb-8 md:pt-10 md:pb-10 lg:pt-12 lg:pb-12" style={{ background: 'var(--bg-secondary)', transition: 'background-color 0.3s' }} aria-labelledby="testimonials-heading">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p
            className="text-reveal"
            style={{ color: GOLD, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', marginBottom: '0.75rem' }}
          >
            Testimonials
          </p>
          <h2
            id="testimonials-heading"
            className="text-reveal"
            style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, color: 'var(--text-primary)', transition: 'color 0.3s' }}
          >
            What Our Clients Say
          </h2>
        </div>

        {/* Desktop carousel */}
        <div className="hidden md:block relative">
          <div ref={desktopContainerRef} className="grid grid-cols-3 gap-6 items-center">
            {visibleIndices.map((idx, pos) => (
              <div key={`${TESTIMONIALS[idx].id}-${pos}`}>
                <TestimonialCard testimonial={TESTIMONIALS[idx]} isCenter={pos === 1} />
              </div>
            ))}
          </div>
          <div style={{ position: 'absolute', left: '-1.25rem', top: '50%', transform: 'translateY(-50%)' }}>
            <ArrowBtn onClick={prev} label="Previous testimonial"><ChevronLeft className="w-5 h-5" /></ArrowBtn>
          </div>
          <div style={{ position: 'absolute', right: '-1.25rem', top: '50%', transform: 'translateY(-50%)' }}>
            <ArrowBtn onClick={next} label="Next testimonial"><ChevronRight className="w-5 h-5" /></ArrowBtn>
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <div ref={mobileContainerRef}>
            <TestimonialCard testimonial={TESTIMONIALS[displayIndex]} isCenter />
          </div>
          <div className="flex items-center justify-center gap-4" style={{ marginTop: '1.5rem' }}>
            <ArrowBtn onClick={prev} label="Previous"><ChevronLeft className="w-5 h-5" /></ArrowBtn>
            <div className="flex gap-2" role="tablist" aria-label="Testimonial navigation">
              {TESTIMONIALS.map((_, idx) => (
                <button key={idx} role="tab" aria-selected={idx === activeIndex} aria-label={`Go to testimonial ${idx + 1}`} onClick={() => changeIndex(idx)}
                  style={{ borderRadius: '9999px', border: 'none', cursor: 'pointer', transition: 'all 0.3s', width: idx === activeIndex ? '1.5rem' : '0.5rem', height: '0.5rem', background: idx === activeIndex ? GOLD : '#d1d5db' }}
                />
              ))}
            </div>
            <ArrowBtn onClick={next} label="Next"><ChevronRight className="w-5 h-5" /></ArrowBtn>
          </div>
        </div>

        {/* Desktop dots */}
        <div className="hidden md:flex justify-center gap-2" style={{ marginTop: '2rem' }} role="tablist" aria-label="Testimonial navigation">
          {TESTIMONIALS.map((_, idx) => (
            <button key={idx} role="tab" aria-selected={idx === activeIndex} aria-label={`Go to testimonial ${idx + 1}`} onClick={() => changeIndex(idx)}
              style={{ borderRadius: '9999px', border: 'none', cursor: 'pointer', transition: 'all 0.3s', width: idx === activeIndex ? '1.5rem' : '0.5rem', height: '0.5rem', background: idx === activeIndex ? GOLD : '#d1d5db' }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
