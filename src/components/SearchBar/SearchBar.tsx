import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapPin, Home, IndianRupee, Search } from 'lucide-react';
import { LOCATION_OPTIONS, PROPERTY_TYPE_OPTIONS, BUDGET_OPTIONS } from '@/utils/constants';
import { Dropdown } from '@/components/ui/Dropdown';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const GOLD = '#C9A84C';

interface SearchState {
  location: string;
  propertyType: string;
  budget: string;
}

export const SearchBar: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchBarRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState<SearchState>({
    location: searchParams.get('location') || LOCATION_OPTIONS[0],
    propertyType: searchParams.get('type') || PROPERTY_TYPE_OPTIONS[0],
    budget: searchParams.get('budget') || BUDGET_OPTIONS[0],
  });

  useEffect(() => {
    setSearch({
      location: searchParams.get('location') || LOCATION_OPTIONS[0],
      propertyType: searchParams.get('type') || PROPERTY_TYPE_OPTIONS[0],
      budget: searchParams.get('budget') || BUDGET_OPTIONS[0],
    });
  }, [searchParams]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search.location !== 'All Locations') params.set('location', search.location);
    if (search.propertyType !== 'All Types') params.set('type', search.propertyType);
    if (search.budget !== 'Any Budget') params.set('budget', search.budget);
    
    navigate(`/?${params.toString()}#featured-properties-section`);
  };

  const updateField = (field: keyof SearchState) => (value: string) => {
    const newState = { ...search, [field]: value };
    setSearch(newState);
    
    const params = new URLSearchParams();
    if (newState.location !== 'All Locations') params.set('location', newState.location);
    if (newState.propertyType !== 'All Types') params.set('type', newState.propertyType);
    if (newState.budget !== 'Any Budget') params.set('budget', newState.budget);
    
    navigate(`/?${params.toString()}#featured-properties-section`, { replace: true });
  };

  useGSAP(() => {
    gsap.from(searchBarRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      delay: 0.5,
      ease: 'power2.out'
    });
  }, []);

  return (
    <div
      className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 w-full z-20 -mt-10 sm:-mt-12 md:-mt-[52px]"
    >
      <div
        ref={searchBarRef}
        style={{ 
          background: 'var(--glass-bg)', 
          backdropFilter: 'blur(16px)', 
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--glass-border)',
          borderRadius: '1rem', 
          boxShadow: '0 12px 40px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,1)'
        }}
      >
        <div className="flex flex-col md:flex-row items-stretch">
          {/* Location */}
          <div className="flex-1 p-4 md:py-5 md:px-5">
            <Dropdown id="search-location" label="Location" icon={<MapPin className="w-4 h-4" />} value={search.location} options={LOCATION_OPTIONS} onChange={updateField('location')} />
          </div>

          <div className="hidden md:block w-px self-stretch mx-1" style={{ background: 'var(--border-color)', transition: 'background-color 0.3s' }} aria-hidden="true" />

          {/* Property Type */}
          <div className="flex-1 p-4 md:py-5 md:px-5 border-t border-[#f3f4f6] md:border-t-0" >
            <Dropdown id="search-property-type" label="Property Type" icon={<Home className="w-4 h-4" />} value={search.propertyType} options={PROPERTY_TYPE_OPTIONS} onChange={updateField('propertyType')} />
          </div>

          <div className="hidden md:block w-px self-stretch mx-1" style={{ background: 'var(--border-color)', transition: 'background-color 0.3s' }} aria-hidden="true" />

          {/* Budget */}
          <div className="flex-1 p-4 md:py-5 md:px-5 border-t border-[#f3f4f6] md:border-t-0">
            <Dropdown id="search-budget" label="Budget" icon={<IndianRupee className="w-4 h-4" />} value={search.budget} options={BUDGET_OPTIONS} onChange={updateField('budget')} />
          </div>

          {/* Search Button */}
          <div className="flex-shrink-0 p-3 flex items-center border-t border-[#f3f4f6] md:border-t-0">
            <button
              onClick={handleSearch}
              className="btn-gold flex items-center justify-center gap-2 w-full md:w-auto whitespace-nowrap font-bold"
              style={{ padding: '0.875rem 1.5rem', borderRadius: '0.75rem', fontSize: '0.875rem', letterSpacing: '0.04em' }}
              aria-label="Search properties"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
              Search Properties
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
