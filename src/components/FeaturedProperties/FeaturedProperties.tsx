import React, { useRef, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PropertyCard } from '@/components/PropertyCard/PropertyCard';
import { useApp } from '@/context/AppContext';
import { useGsapScrollReveal, useGsapTextScroll } from '@/utils/animations';

const GOLD = '#C9A84C';
const NAVY = '#0B1120';

export const FeaturedProperties: React.FC = () => {
  const { properties } = useApp();
  const sectionRef = useRef<HTMLElement>(null);
  
  useGsapScrollReveal(sectionRef);
  useGsapTextScroll(sectionRef);

  const [searchParams] = useSearchParams();
  const locationParam = searchParams.get('location');
  const typeParam = searchParams.get('type');
  const budgetParam = searchParams.get('budget');

  // Filter for properties that are both featured and visible on the website
  const filteredFeaturedProperties = useMemo(() => {
    let result = properties.filter((p) => p.featured && p.showOnWebsite);

    if (locationParam) {
      result = result.filter((p) => 
        p.location.toLowerCase().includes(locationParam.toLowerCase()) || 
        locationParam.toLowerCase().includes(p.location.toLowerCase())
      );
    }

    if (typeParam) {
      result = result.filter((p) => {
        if (typeParam === 'Commercial Office' && p.type === 'Commercial') return true;
        if (typeParam === 'Plot / Land' && p.type === 'Plot') return true;
        if (typeParam === 'Row House' && p.type === 'Independent House') return true;
        return p.type === typeParam || p.type + 's' === typeParam;
      });
    }

    if (budgetParam) {
      result = result.filter((p) => {
        const val = p.priceVal;
        if (budgetParam === 'Under ₹50 Lakh') return val < 5000000;
        if (budgetParam === '₹50L – ₹1 Crore') return val >= 5000000 && val <= 10000000;
        if (budgetParam === '₹1Cr – ₹2 Crore') return val >= 10000000 && val <= 20000000;
        if (budgetParam === '₹2Cr – ₹5 Crore') return val >= 20000000 && val <= 50000000;
        if (budgetParam === '₹5Cr – ₹10 Crore') return val >= 50000000 && val <= 100000000;
        if (budgetParam === 'Above ₹10 Crore') return val > 100000000;
        return true;
      });
    }

    return result;
  }, [properties, locationParam, typeParam, budgetParam]);

  return (
    <section id="featured-properties-section" ref={sectionRef} className="pt-16 pb-8 md:pt-20 md:pb-10 lg:pt-24 lg:pb-12" style={{ background: 'var(--bg-secondary)', transition: 'background-color 0.3s' }} aria-labelledby="featured-properties-heading">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p
            className="text-reveal text-xl sm:text-2xl lg:text-4xl"
            style={{ color: GOLD, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', marginBottom: '0.75rem' }}
          >
            Featured Properties
          </p>
          <h2
            id="featured-properties-heading"
            className="text-reveal text-3xl sm:text-4xl"
            style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2, transition: 'color 0.3s' }}
          >
            Handpicked Properties For You
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" style={{ marginBottom: '2.5rem' }}>
          {filteredFeaturedProperties.length > 0 ? (
            filteredFeaturedProperties.map((property, index) => (
              <PropertyCard key={property.id} property={property} index={index} />
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <h3 style={{ fontFamily: '"Playfair Display", serif', color: 'var(--text-primary)' }} className="text-xl font-bold mb-2">No Properties Found</h3>
              <p className="text-gray-500 font-inter">Try adjusting your filters in the search bar above.</p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div
          className="reveal-item"
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <Link
            to={`/properties?${searchParams.toString()}`}
            className="btn-gold flex items-center gap-2"
            style={{ 
              padding: '1rem 2.5rem', 
              borderRadius: '0.5rem', 
              fontSize: '1rem', 
              fontWeight: 700, 
              letterSpacing: '0.05em', 
              textDecoration: 'none',
              boxShadow: '0 4px 14px 0 rgba(201, 168, 76, 0.39)',
            }}
            aria-label="View all properties"
          >
            View All Properties
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};

