import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall } from 'lucide-react';
import { PHONE_HREF, PHONE_NUMBER } from '@/utils/constants';
import { useGsapScrollReveal } from '@/utils/animations';

const GOLD = '#C9A84C';
const NAVY = '#0B1120';

export const CTASection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useGsapScrollReveal(sectionRef);

  return (
    <section ref={sectionRef} className="py-8 md:py-10 lg:py-12" aria-labelledby="cta-heading">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          style={{ borderRadius: '1.25rem', background: NAVY }}
          className="reveal-item flex flex-col md:flex-row md:justify-between items-center gap-6 px-5 py-8 md:px-10 md:py-8"
        >
          {/* Left */}
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '3.5rem', height: '3.5rem', borderRadius: '50%', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)' }} aria-hidden="true">
              <PhoneCall className="w-6 h-6" style={{ color: GOLD }} />
            </div>
            <div>
              <h2 id="cta-heading" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, color: '#fff', fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)', marginBottom: '0.25rem' }}>
                Looking to Buy, Sell or Rent a Property?
              </h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#9ca3af' }}>
                Get in touch with our experts today!{' '}
                <a href={PHONE_HREF} style={{ color: GOLD, textDecoration: 'none', fontWeight: 500, whiteSpace: 'nowrap' }} aria-label={`Call us at ${PHONE_NUMBER}`}>{PHONE_NUMBER}</a>
              </p>
            </div>
          </div>

          {/* Right */}
          <Link
            to="/contact"
            className="btn-gold flex-shrink-0"
            style={{ padding: '0.875rem 2rem', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.04em', textDecoration: 'none', whiteSpace: 'nowrap' }}
            aria-label="Contact us today"
          >
            Contact Us Today
          </Link>
        </div>
      </div>
    </section>
  );
};
