import React, { useRef } from 'react';
import { useGsapScrollReveal } from '@/utils/animations';

interface SectionHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export const SectionHeader = React.memo<SectionHeaderProps>(
  ({ label, title, subtitle, centered = true, light = false }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    useGsapScrollReveal(containerRef);

    return (
      <div ref={containerRef} className={`mb-12 ${centered ? 'text-center' : ''}`}>
        {label && (
          <p
            className="reveal-item mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-500"
            style={{ color: '#C9A84C' }}
          >
            {label}
          </p>
        )}
        <h2
          className={`reveal-item font-serif font-bold leading-tight ${
            light ? 'text-white' : 'text-navy-900'
          }`}
          style={{ fontFamily: '"Playfair Display", serif', fontSize: '2.5rem' }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={`reveal-item mt-4 max-w-2xl text-base leading-relaxed ${
              centered ? 'mx-auto' : ''
            } ${light ? 'text-gray-300' : 'text-gray-500'}`}
          >
            {subtitle}
          </p>
        )}
      </div>
    );
  }
);

SectionHeader.displayName = 'SectionHeader';
