import React from 'react';

const GOLD = '#C9A84C';

interface SkeletonProps { className?: string; }

export const Skeleton = React.memo<SkeletonProps>(({ className = '' }) => (
  <div className={`skeleton ${className}`} aria-hidden="true" />
));
Skeleton.displayName = 'Skeleton';

export const PropertyCardSkeleton = React.memo(() => (
  <div style={{ borderRadius: '0.75rem', overflow: 'hidden', background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
    <div className="skeleton" style={{ height: '13rem', width: '100%' }} />
    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div className="skeleton" style={{ height: '1.25rem', width: '75%' }} />
      <div className="skeleton" style={{ height: '1rem', width: '50%' }} />
      <div className="skeleton" style={{ height: '1.5rem', width: '65%' }} />
      <div className="flex gap-4 pt-1">
        <div className="skeleton" style={{ height: '1rem', width: '4rem' }} />
        <div className="skeleton" style={{ height: '1rem', width: '4rem' }} />
        <div className="skeleton" style={{ height: '1rem', width: '4rem' }} />
      </div>
    </div>
  </div>
));
PropertyCardSkeleton.displayName = 'PropertyCardSkeleton';

export const SectionSkeleton = React.memo(() => (
  <div className="section-padding" style={{ background: '#f9fafb' }}>
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div style={{ textAlign: 'center', marginBottom: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
        <div className="skeleton" style={{ height: '1rem', width: '10rem', borderRadius: '0.25rem' }} />
        <div className="skeleton" style={{ height: '2rem', width: '18rem', borderRadius: '0.25rem' }} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
      </div>
    </div>
  </div>
));
SectionSkeleton.displayName = 'SectionSkeleton';

// Simple gold spinner for page-level loading
export const PageSpinner = React.memo(() => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <div
        style={{ width: '3rem', height: '3rem', borderRadius: '50%', border: `4px solid rgba(201,168,76,0.2)`, borderTopColor: GOLD }}
        className="animate-spin"
        aria-label="Loading page..."
        role="status"
      />
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#9ca3af' }}>Loading…</p>
    </div>
  </div>
));
PageSpinner.displayName = 'PageSpinner';
