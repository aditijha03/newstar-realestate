import React, { Suspense, useRef } from 'react';
import { Hero } from '@/components/Hero/Hero';
import { SearchBar } from '@/components/SearchBar/SearchBar';
import { SectionSkeleton } from '@/components/ui/Skeletons';
import { useGsapScrollReveal } from '@/utils/animations';

// Lazy-load below-the-fold sections
const FeaturedProperties = React.lazy(
  () => import('@/components/FeaturedProperties/FeaturedProperties').then((m) => ({ default: m.FeaturedProperties }))
);
const WhyChooseUs = React.lazy(
  () => import('@/components/WhyChooseUs/WhyChooseUs').then((m) => ({ default: m.WhyChooseUs }))
);
const Testimonials = React.lazy(
  () => import('@/components/Testimonials/Testimonials').then((m) => ({ default: m.Testimonials }))
);
const CTASection = React.lazy(
  () => import('@/components/CTASection/CTASection').then((m) => ({ default: m.CTASection }))
);

const TestimonialSkeleton = () => (
  <div className="section-padding bg-gray-50 dark:bg-navy-950 transition-colors duration-300">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12 space-y-3">
        <div className="h-4 w-36 bg-gray-200 animate-pulse rounded mx-auto" />
        <div className="h-8 w-64 bg-gray-200 animate-pulse rounded mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-card space-y-4 animate-pulse dark:bg-navy-900 transition-colors duration-300">
            <div className="h-8 w-8 bg-gray-200 rounded" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-4/6" />
            </div>
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-navy-800 transition-colors duration-300">
              <div className="w-10 h-10 rounded-full bg-gray-200" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-24 bg-gray-200 rounded" />
                <div className="h-3 w-20 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const CTASkeleton = () => (
  <div className="py-10 px-4">
    <div className="mx-auto max-w-7xl">
      <div className="rounded-2xl h-24 bg-gray-200 animate-pulse" />
    </div>
  </div>
);

import { HomePageScrollLine } from '@/components/HomePageScrollLine/HomePageScrollLine';

const HomePage: React.FC = () => {
  const mainRef = useRef<HTMLElement>(null);
  
  // Register the global scroll reveal for this page
  useGsapScrollReveal(mainRef, '.section-reveal');

  return (
    <main id="main-content" ref={mainRef} className="relative">
      
      {/* Content Wrapper for Scroll Line - Ends before CTA to prevent overlap */}
      <div className="relative">
        <HomePageScrollLine />
        
        {/* Above the fold — always rendered */}
        <Hero />
        <SearchBar />

        {/* Below the fold — lazy loaded */}
        <div className="section-reveal" style={{ opacity: 0 }}>
          <Suspense fallback={<SectionSkeleton />}>
            <FeaturedProperties />
          </Suspense>
        </div>

        <div className="section-reveal" style={{ opacity: 0 }}>
          <Suspense fallback={<SectionSkeleton />}>
            <WhyChooseUs />
          </Suspense>
        </div>

        <div className="section-reveal" style={{ opacity: 0 }}>
          <Suspense fallback={<TestimonialSkeleton />}>
            <Testimonials />
          </Suspense>
        </div>
      </div>

      {/* CTA Section is kept outside the route line wrapper so Navi Mumbai marker never overlaps it */}
      <div className="section-reveal" style={{ opacity: 0 }}>
        <Suspense fallback={<CTASkeleton />}>
          <CTASection />
        </Suspense>
      </div>
    </main>
  );
};

export default HomePage;