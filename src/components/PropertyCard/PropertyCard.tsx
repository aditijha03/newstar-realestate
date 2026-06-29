import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Car } from 'lucide-react';
import type { Property } from '@/utils/constants';
import { useGsapImageScale } from '@/utils/animations';

const GOLD = '#C9A84C';
const NAVY = '#0B1120';

interface PropertyCardProps {
  property: Property;
  index?: number;
}

export const PropertyCard = React.memo<PropertyCardProps>(({ property, index = 0 }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const cardRef = useRef<HTMLElement>(null);

  useGsapImageScale(cardRef as any, '.hover-scale-container');

  return (
    <Link to={`/properties/${property.id}`} className="block text-inherit no-underline">
      <article
      ref={cardRef}
      className="group card cursor-pointer reveal-item"
      style={{ borderRadius: '0.75rem', overflow: 'hidden' }}
      role="article"
      aria-label={`Property: ${property.title}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden hover-scale-container" style={{ height: '13rem', background: '#f3f4f6' }}>
        {!imgLoaded && (
          <div className="absolute inset-0 skeleton" aria-hidden="true" />
        )}
        <img
          src={property.image}
          alt={`${property.title} — ${property.location}`}
          className="w-full h-full object-cover"
          style={{ opacity: imgLoaded ? 1 : 0 }}
          loading="lazy"
          decoding="async"
          width={600}
          height={400}
          onLoad={() => setImgLoaded(true)}
        />

        {/* Badge */}
        <span
          className="absolute top-3 left-3"
          style={{
            padding: '3px 10px',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            borderRadius: '4px',
            fontFamily: 'Inter, sans-serif',
            background: property.badge === 'FOR RENT' ? 'rgba(37, 99, 235, 0.85)' : 'rgba(201, 168, 76, 0.85)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            color: '#fff',
          }}
          aria-label={`Status: ${property.badge}`}
        >
          {property.badge}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '1rem' }}>
        <h3
          style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem', lineHeight: 1.3, marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', transition: 'color 0.2s' }}
        >
          {property.title}
        </h3>

        <p className="flex items-center gap-1" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontFamily: 'Inter, sans-serif', transition: 'color 0.2s' }}>
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: GOLD }} aria-hidden="true" />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{property.location}</span>
        </p>

        <p
          style={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            fontSize: '1.125rem',
            marginBottom: '0.75rem',
            color: property.badge === 'FOR RENT' ? GOLD : 'var(--text-primary)',
            transition: 'color 0.2s'
          }}
          aria-label={`Price: ${property.price}`}
        >
          {property.price}
        </p>

        <div style={{ height: '1px', background: 'var(--border-light)', marginBottom: '0.75rem', transition: 'background-color 0.2s' }} aria-hidden="true" />

        <div className="flex items-center flex-wrap gap-3" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif', transition: 'color 0.2s' }}>
          {property.beds !== undefined && (
            <span className="flex items-center gap-1" aria-label={`${property.beds} bedrooms`}>
              <Bed className="w-3.5 h-3.5" style={{ color: '#9ca3af' }} aria-hidden="true" />
              {property.beds} Beds
            </span>
          )}
          {property.baths !== undefined && (
            <span className="flex items-center gap-1" aria-label={`${property.baths} bathrooms`}>
              <Bath className="w-3.5 h-3.5" style={{ color: '#9ca3af' }} aria-hidden="true" />
              {property.baths} Baths
            </span>
          )}
          <span className="flex items-center gap-1" aria-label={`Area: ${property.area}`}>
            <Square className="w-3.5 h-3.5" style={{ color: '#9ca3af' }} aria-hidden="true" />
            {property.area}
          </span>
          {property.parking !== undefined && (
            <span className="flex items-center gap-1" aria-label={`${property.parking} parking spots`}>
              <Car className="w-3.5 h-3.5" style={{ color: '#9ca3af' }} aria-hidden="true" />
              {property.parking} Parking
            </span>
          )}
        </div>
      </div>
    </article>
    </Link>
  );
});

PropertyCard.displayName = 'PropertyCard';
