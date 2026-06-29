import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { PropertyCard } from '@/components/PropertyCard/PropertyCard';
import { Dropdown } from '@/components/ui/Dropdown';
import { MapPin, Bed, Bath, Square, Car, SlidersHorizontal, Grid, List, X, ChevronRight, Search } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { PROPERTY_TYPE_OPTIONS, LOCATION_OPTIONS } from '@/utils/constants';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const GOLD = '#C9A84C';
const NAVY = '#0B1120';

// Hero background image for luxury feel
const HERO_BG = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80';

const MobileFilterDrawer = React.memo(({ isOpen, onClose, children }: { isOpen: boolean, onClose: () => void, children: React.ReactNode }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const overlayRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else if (shouldRender) {
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 });
      gsap.to(drawerRef.current, { x: '100%', duration: 0.3, ease: 'power2.in', onComplete: () => setShouldRender(false) });
    }
  }, [isOpen]);

  useGSAP(() => {
    if (isOpen && shouldRender) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 0.5, duration: 0.2 });
      gsap.fromTo(drawerRef.current, { x: '100%' }, { x: '0%', duration: 0.3, ease: 'power2.out' });
    }
  }, [isOpen, shouldRender]);

  if (!shouldRender) return null;

  return (
    <>
      <div
        ref={overlayRef}
        onClick={onClose}
        className="fixed inset-0 bg-black z-50 lg:hidden"
        style={{ opacity: 0 }}
      />
      <div
        ref={drawerRef}
        className="fixed right-0 top-0 bottom-0 w-80 max-w-full bg-white z-50 p-6 overflow-y-auto lg:hidden shadow-2xl flex flex-col dark:bg-navy-900 transition-colors duration-300"
        style={{ transform: 'translateX(100%)' }}
      >
        {children}
      </div>
    </>
  );
});
MobileFilterDrawer.displayName = 'MobileFilterDrawer';

import { useGsapScrollReveal, useGsapTextScroll, useGsapParallax, useGsapStaggerReveal } from '@/utils/animations';

export const PropertiesPage: React.FC = () => {
  const { properties } = useApp();
  const [searchParams] = useSearchParams();
  const mainRef = useRef<HTMLElement>(null);
  
  useGsapScrollReveal(mainRef);
  useGsapTextScroll(mainRef);
  useGsapParallax(mainRef);
  useGsapStaggerReveal(mainRef, '.stagger-container', '.stagger-item');

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedBadge, setSelectedBadge] = useState('All'); // All, FOR SALE, FOR RENT
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedBudget, setSelectedBudget] = useState('Any Budget');
  const [selectedBeds, setSelectedBeds] = useState('Any'); // Any, 1, 2, 3, 4+
  const [selectedFurnishing, setSelectedFurnishing] = useState('All Furnishings');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');

  // Pending (Draft) Filters State
  const [pendingSearchQuery, setPendingSearchQuery] = useState('');
  const [pendingSelectedType, setPendingSelectedType] = useState('All Types');
  const [pendingSelectedBadge, setPendingSelectedBadge] = useState('All');
  const [pendingSelectedLocation, setPendingSelectedLocation] = useState('All Locations');
  const [pendingSelectedBudget, setPendingSelectedBudget] = useState('Any Budget');
  const [pendingSelectedBeds, setPendingSelectedBeds] = useState('Any');
  const [pendingSelectedFurnishing, setPendingSelectedFurnishing] = useState('All Furnishings');
  const [pendingSelectedStatus, setPendingSelectedStatus] = useState('All Statuses');

  // UI State
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest'); // newest, price-asc, price-desc
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Use static types so it matches the SearchBar
  const types = PROPERTY_TYPE_OPTIONS;

  // Extract unique locations and merge with static options
  const locations = useMemo(() => {
    const publicProps = properties.filter((p) => p.showOnWebsite);
    const locs = new Set<string>(LOCATION_OPTIONS);
    publicProps.forEach((p) => {
      locs.add(p.location);
      const city = p.location.split(',').pop()?.trim();
      if (city) locs.add(city);
    });
    return Array.from(locs);
  }, [properties]);

  // Sync with URL query parameters
  useEffect(() => {
    const loc = searchParams.get('location');
    const typeParam = searchParams.get('type');
    const bud = searchParams.get('budget');

    if (loc) {
      setSelectedLocation(loc);
      setPendingSelectedLocation(loc);
    }
    if (typeParam) {
      const matched = types.find(
        (t) =>
          t.toLowerCase() === typeParam.toLowerCase() ||
          t.toLowerCase() === (typeParam + 's').toLowerCase() ||
          (t === 'Commercial Office' && typeParam.toLowerCase() === 'commercial') ||
          (t === 'Plot / Land' && typeParam.toLowerCase() === 'plot')
      );
      if (matched) {
        setSelectedType(matched);
        setPendingSelectedType(matched);
      } else {
        setSelectedType(typeParam);
        setPendingSelectedType(typeParam);
      }
    }
    if (bud) {
      setSelectedBudget(bud);
      setPendingSelectedBudget(bud);
    }
  }, [searchParams, types]);

  // Sync pending states when the mobile filter drawer opens
  useEffect(() => {
    if (isMobileFilterOpen) {
      setPendingSearchQuery(searchQuery);
      setPendingSelectedType(selectedType);
      setPendingSelectedBadge(selectedBadge);
      setPendingSelectedLocation(selectedLocation);
      setPendingSelectedBudget(selectedBudget);
      setPendingSelectedBeds(selectedBeds);
      setPendingSelectedFurnishing(selectedFurnishing);
      setPendingSelectedStatus(selectedStatus);
    }
  }, [isMobileFilterOpen, searchQuery, selectedType, selectedBadge, selectedLocation, selectedBudget, selectedBeds, selectedFurnishing, selectedStatus]);

  // Count unapplied filter changes
  const pendingChangesCount = useMemo(() => {
    let count = 0;
    if (pendingSearchQuery.trim() !== searchQuery.trim()) count++;
    if (pendingSelectedType !== selectedType) count++;
    if (pendingSelectedBadge !== selectedBadge) count++;
    if (pendingSelectedLocation !== selectedLocation) count++;
    if (pendingSelectedBudget !== selectedBudget) count++;
    if (pendingSelectedBeds !== selectedBeds) count++;
    if (pendingSelectedFurnishing !== selectedFurnishing) count++;
    if (pendingSelectedStatus !== selectedStatus) count++;
    return count;
  }, [
    pendingSearchQuery, searchQuery,
    pendingSelectedType, selectedType,
    pendingSelectedBadge, selectedBadge,
    pendingSelectedLocation, selectedLocation,
    pendingSelectedBudget, selectedBudget,
    pendingSelectedBeds, selectedBeds,
    pendingSelectedFurnishing, selectedFurnishing,
    pendingSelectedStatus, selectedStatus
  ]);

  // Handle applying filters
  const applyFilters = () => {
    setSearchQuery(pendingSearchQuery);
    setSelectedType(pendingSelectedType);
    setSelectedBadge(pendingSelectedBadge);
    setSelectedLocation(pendingSelectedLocation);
    setSelectedBudget(pendingSelectedBudget);
    setSelectedBeds(pendingSelectedBeds);
    setSelectedFurnishing(pendingSelectedFurnishing);
    setSelectedStatus(pendingSelectedStatus);
    setCurrentPage(1);
    setIsMobileFilterOpen(false);

    // Smooth scroll to results
    setTimeout(() => {
      const element = document.getElementById('listings-grid');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Handle resetting filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedType('All Types');
    setSelectedBadge('All');
    setSelectedLocation('All Locations');
    setSelectedBudget('Any Budget');
    setSelectedBeds('Any');
    setSelectedFurnishing('All Furnishings');
    setSelectedStatus('All Statuses');

    setPendingSearchQuery('');
    setPendingSelectedType('All Types');
    setPendingSelectedBadge('All');
    setPendingSelectedLocation('All Locations');
    setPendingSelectedBudget('Any Budget');
    setPendingSelectedBeds('Any');
    setPendingSelectedFurnishing('All Furnishings');
    setPendingSelectedStatus('All Statuses');
    setCurrentPage(1);
  };

  // Helper to check if property matches budget range
  const matchesBudget = (priceVal: number, budgetLabel: string) => {
    if (budgetLabel === 'Any Budget') return true;
    if (budgetLabel === 'Under ₹50 Lakh') return priceVal < 5000000;
    if (budgetLabel === '₹50L – ₹1 Crore') return priceVal >= 5000000 && priceVal <= 10000000;
    if (budgetLabel === '₹1Cr – ₹2 Crore') return priceVal >= 10000000 && priceVal <= 20000000;
    if (budgetLabel === '₹2Cr – ₹5 Crore') return priceVal >= 20000000 && priceVal <= 50000000;
    if (budgetLabel === '₹5Cr – ₹10 Crore') return priceVal >= 50000000 && priceVal <= 100000000;
    if (budgetLabel === 'Above ₹10 Crore') return priceVal > 100000000;
    return true;
  };

  // Process & filter properties list
  const filteredProperties = useMemo(() => {
    let result = properties.filter((p) => p.showOnWebsite);

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Type
    if (selectedType !== 'All Types') {
      result = result.filter((p) => {
        if (selectedType === 'Commercial Office' && p.type === 'Commercial') return true;
        if (selectedType === 'Plot / Land' && p.type === 'Plot') return true;
        if (selectedType === 'Row House' && p.type === 'Independent House') return true;
        return p.type === selectedType || p.type + 's' === selectedType;
      });
    }

    // Badge (Sale/Rent)
    if (selectedBadge !== 'All') {
      result = result.filter((p) => p.badge === selectedBadge);
    }

    // Location
    if (selectedLocation !== 'All Locations') {
      result = result.filter(
        (p) =>
          p.location.toLowerCase().includes(selectedLocation.toLowerCase()) ||
          selectedLocation.toLowerCase().includes(p.location.toLowerCase())
      );
    }

    // Budget
    if (selectedBudget !== 'Any Budget') {
      result = result.filter((p) => matchesBudget(p.priceVal, selectedBudget));
    }

    // Beds
    if (selectedBeds !== 'Any') {
      if (selectedBeds === '4+') {
        result = result.filter((p) => (p.beds || 0) >= 4);
      } else {
        result = result.filter((p) => (p.beds || 0) === parseInt(selectedBeds, 10));
      }
    }

    // Furnishing
    if (selectedFurnishing !== 'All Furnishings') {
      result = result.filter((p) => p.furnishing === selectedFurnishing);
    }

    // Status
    if (selectedStatus !== 'All Statuses') {
      result = result.filter((p) => p.status === selectedStatus);
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.priceVal - b.priceVal);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.priceVal - a.priceVal);
    } else {
      // default newest first: by id descending or default mock order
      result = [...result].sort((a, b) => {
        const idA = a.id?.toString() || '';
        const idB = b.id?.toString() || '';
        return idB.localeCompare(idA, undefined, { numeric: true, sensitivity: 'base' });
      });
    }

    return result;
  }, [
    properties,
    searchQuery,
    selectedType,
    selectedBadge,
    selectedLocation,
    selectedBudget,
    selectedBeds,
    selectedFurnishing,
    selectedStatus,
    sortBy,
  ]);

  // Pagination
  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProperties.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProperties, currentPage]);

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

  const FilterControls = () => (
    <div className="space-y-6">
      {/* Search Bar */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 font-inter dark:text-navy-200 transition-colors duration-300">
          Search Properties
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search city, neighborhood, keyword..."
            value={pendingSearchQuery}
            onChange={(e) => setPendingSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm font-inter text-gray-800 placeholder-gray-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy dark:bg-navy-900 dark:border-navy-700 dark:text-gray-100 transition-colors duration-300"
          />
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400 dark:text-navy-300 transition-colors duration-300" />
        </div>
      </div>

      {/* Sale or Rent */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 font-inter dark:text-navy-200 transition-colors duration-300">
          Listing Type
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['All', 'FOR SALE', 'FOR RENT'].map((badge) => (
            <button
              key={badge}
              onClick={() => setPendingSelectedBadge(badge)}
              className={`py-2 text-xs font-semibold rounded-lg font-inter transition-all ${
                pendingSelectedBadge === badge
                  ? 'bg-navy text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {badge === 'All' ? 'All' : badge === 'FOR SALE' ? 'Buy' : 'Rent'}
            </button>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div className="z-[60]">
        <Dropdown
          id="filter-property-type"
          label="Property Type"
          value={pendingSelectedType}
          options={types}
          onChange={setPendingSelectedType}
          variant="filter"
        />
      </div>

      {/* Location */}
      <div className="z-[50]">
        <Dropdown
          id="filter-location"
          label="Location"
          value={pendingSelectedLocation}
          options={locations}
          onChange={setPendingSelectedLocation}
          variant="filter"
        />
      </div>

      {/* Budget */}
      <div className="z-[40]">
        <Dropdown
          id="filter-budget"
          label="Budget"
          value={pendingSelectedBudget}
          options={['Any Budget', 'Under ₹50 Lakh', '₹50L – ₹1 Crore', '₹1Cr – ₹2 Crore', '₹2Cr – ₹5 Crore', '₹5Cr – ₹10 Crore', 'Above ₹10 Crore']}
          onChange={setPendingSelectedBudget}
          variant="filter"
        />
      </div>

      {/* Bedrooms */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 font-inter dark:text-navy-200 transition-colors duration-300">
          Bedrooms
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {['Any', '1', '2', '3', '4+'].map((beds) => (
            <button
              key={beds}
              onClick={() => setPendingSelectedBeds(beds)}
              className={`py-2 text-xs font-semibold rounded-lg font-inter transition-all ${
                pendingSelectedBeds === beds
                  ? 'bg-navy text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {beds}
            </button>
          ))}
        </div>
      </div>

      {/* Furnishing */}
      <div className="z-[30]">
        <Dropdown
          id="filter-furnishing"
          label="Furnishing"
          value={pendingSelectedFurnishing}
          options={['All Furnishings', 'Furnished', 'Semi-Furnished', 'Unfurnished']}
          onChange={setPendingSelectedFurnishing}
          variant="filter"
        />
      </div>

      {/* Construction Status */}
      <div className="z-[20]">
        <Dropdown
          id="filter-status"
          label="Construction Status"
          value={pendingSelectedStatus}
          options={['All Statuses', 'Ready to Move', 'Under Construction', 'New Launch']}
          onChange={setPendingSelectedStatus}
          variant="filter"
        />
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-navy-800 transition-colors duration-300">
        <button
          onClick={applyFilters}
          className="w-full py-2.5 text-xs font-semibold rounded-lg text-white font-inter transition-all shadow-md relative overflow-hidden flex items-center justify-center"
          style={{ backgroundColor: 'var(--bg-secondary)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = GOLD;
            e.currentTarget.style.color = NAVY;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = NAVY;
            e.currentTarget.style.color = '#fff';
          }}
        >
          Apply Filters
          {pendingChangesCount > 0 && ` • ${pendingChangesCount}`}
        </button>
        <button
          onClick={resetFilters}
          className="w-full py-2.5 text-xs font-semibold rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 font-inter transition-all dark:border-navy-700 dark:text-navy-200 dark:hover:bg-navy-800"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );

  return (
    <main id="main-content" ref={mainRef} className="bg-gray-50 min-h-screen dark:bg-navy-950 transition-colors duration-300">
      {/* Luxury Hero Banner */}
      <section className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden">
        <div
          className="parallax-img absolute left-0 w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_BG})`, height: '130%', top: '-15%', objectFit: 'cover' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(rgba(11,17,32,0.8), rgba(11,17,32,0.65))' }}
        />
        <div className="relative text-center px-4 sm:px-6 lg:px-8 space-y-4">
          <h1
            style={{ fontFamily: '"Playfair Display", serif', color: '#fff', fontWeight: 700 }}
            className="text-3xl md:text-5xl tracking-wide uppercase"
          >
            Properties
          </h1>
          {/* Breadcrumbs */}
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider text-gray-300 font-inter uppercase">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" style={{ color: GOLD }} />
            <span className="text-white">Properties</span>
          </div>
        </div>
      </section>

      {/* Filters & Listing Grid */}
      <section className="pt-6 pb-12 md:pt-8 md:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            
            {/* Desktop Filters Sidebar (Column 1) */}
            <aside className="hidden lg:block lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 dark:bg-navy-900 dark:border-navy-800 transition-colors duration-300">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6 dark:border-navy-800 transition-colors duration-300">
                <h2 style={{ fontFamily: '"Playfair Display", serif', color: 'var(--text-primary)', fontWeight: 700 }} className="text-lg">
                  Filters
                </h2>
                <SlidersHorizontal className="w-4 h-4" style={{ color: GOLD }} />
              </div>
              <FilterControls />
            </aside>

            {/* Main Listings Column (Columns 2-4) */}
            <div className="lg:col-span-3 space-y-6">
              {/* Toolbar */}
              <div id="listings-grid" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100 dark:bg-navy-900 dark:border-navy-800 transition-colors duration-300">
                <div className="text-sm text-gray-500 font-inter dark:text-navy-200 transition-colors duration-300">
                  Showing <span className="font-semibold text-navy dark:text-white transition-colors duration-300">{filteredProperties.length}</span> {filteredProperties.length === 1 ? 'Property' : 'Properties'}
                </div>
                
                <div className="flex items-center gap-3 justify-between sm:justify-end">
                  {/* Sorting dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-400 font-inter uppercase tracking-wider dark:text-navy-300 transition-colors duration-300">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs font-semibold text-gray-700 font-inter focus:outline-none focus:border-navy dark:bg-navy-950 dark:border-navy-700 dark:text-gray-200 transition-colors duration-300"
                    >
                      <option value="newest">Newest First</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                    </select>
                  </div>

                  {/* Layout mode switcher */}
                  <div className="hidden sm:flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50 dark:border-navy-700 dark:bg-navy-950 transition-colors duration-300">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 transition-all ${viewMode === 'grid' ? 'bg-navy text-white' : 'text-gray-400 hover:text-gray-600'}`}
                      aria-label="Grid view"
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 transition-all ${viewMode === 'list' ? 'bg-navy text-white' : 'text-gray-400 hover:text-gray-600'}`}
                      aria-label="List view"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Mobile filter trigger */}
                  <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="lg:hidden flex items-center gap-1.5 bg-navy text-white py-2 px-3 rounded-lg text-xs font-semibold font-inter shadow-sm"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    Filters
                  </button>
                </div>
              </div>

              {/* Listings Grid/List */}
              {paginatedProperties.length > 0 ? (
                viewMode === 'grid' ? (
                  <div className="stagger-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedProperties.map((property, idx) => (
                      <div key={property.id} className="stagger-item">
                        <PropertyCard property={property} index={idx} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="stagger-container space-y-4">
                    {paginatedProperties.map((property) => (
                      <Link
                        key={property.id}
                        to={`/properties/${property.id}`}
                        className="stagger-item block bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group no-underline text-inherit dark:bg-navy-900 dark:border-navy-800"
                      >
                        <div className="flex flex-col md:flex-row h-full md:h-48">
                          {/* Image */}
                          <div className="w-full md:w-72 h-48 md:h-full flex-shrink-0 relative bg-gray-100 dark:bg-navy-800 transition-colors duration-300">
                            <img
                              src={property.image}
                              alt={property.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <span
                              className="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider text-white"
                              style={{
                                background: property.badge === 'FOR RENT' ? '#2563eb' : 'linear-gradient(135deg, #C9A84C, #E6C97A)',
                                color: property.badge === 'FOR RENT' ? '#fff' : NAVY,
                              }}
                            >
                              {property.badge}
                            </span>
                          </div>
                          {/* Content */}
                          <div className="p-5 flex-1 flex flex-col justify-between">
                            <div className="space-y-2">
                              <h3
                                style={{ fontFamily: '"Playfair Display", serif', color: 'var(--text-primary)' }}
                                className="text-lg font-bold group-hover:text-gold transition-colors"
                              >
                                {property.title}
                              </h3>
                              <p className="flex items-center gap-1 text-xs text-gray-400 font-inter dark:text-navy-300 transition-colors duration-300">
                                <MapPin className="w-3.5 h-3.5 text-gold flex-shrink-0" style={{ color: GOLD }} />
                                {property.location}
                              </p>
                              <p className="text-sm font-semibold text-gray-600 font-inter mt-2 line-clamp-2 dark:text-navy-100 transition-colors duration-300">
                                {property.description}
                              </p>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-gray-100 mt-3 sm:mt-0 dark:border-navy-800 transition-colors duration-300">
                              <span style={{ fontFamily: '"Playfair Display", serif', color: property.badge === 'FOR RENT' ? GOLD : NAVY }} className="text-xl font-bold">
                                {property.price}
                              </span>
                              <div className="flex items-center gap-3 text-xs text-gray-400 font-inter dark:text-navy-300 transition-colors duration-300">
                                {property.beds !== undefined && (
                                  <span className="flex items-center gap-1">
                                    <Bed className="w-3.5 h-3.5 text-gray-400 dark:text-navy-300 transition-colors duration-300" />
                                    {property.beds} Beds
                                  </span>
                                )}
                                {property.baths !== undefined && (
                                  <span className="flex items-center gap-1">
                                    <Bath className="w-3.5 h-3.5 text-gray-400 dark:text-navy-300 transition-colors duration-300" />
                                    {property.baths} Baths
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Square className="w-3.5 h-3.5 text-gray-400 dark:text-navy-300 transition-colors duration-300" />
                                  {property.area}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )
              ) : (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100 space-y-4 dark:bg-navy-900 dark:border-navy-800 transition-colors duration-300">
                  <h3 style={{ fontFamily: '"Playfair Display", serif', color: 'var(--text-primary)' }} className="text-xl font-bold">
                    No Properties Found
                  </h3>
                  <p className="text-sm font-inter text-gray-500 max-w-md mx-auto dark:text-navy-200 transition-colors duration-300">
                    We couldn't find any properties matching your current filter selection. Try clearing filters or expanding your parameters.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="btn-gold py-2 px-6 rounded-lg text-xs font-semibold font-inter shadow-sm"
                  >
                    Reset Filters
                  </button>
                </div>
              )}

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6">
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx + 1}
                      onClick={() => { setCurrentPage(idx + 1); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                      className={`w-9 h-9 text-xs font-semibold rounded-lg font-inter transition-all ${
                        currentPage === idx + 1
                          ? 'bg-navy text-white shadow-sm'
                          : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-navy py-12 md:py-16 text-white text-center relative overflow-hidden" style={{ background: NAVY }}>
        {/* Glow decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold opacity-[0.03] rounded-full blur-[100px]" style={{ backgroundColor: GOLD }} />
        <div className="reveal-item relative mx-auto max-w-xl px-4 space-y-6">
          <h2 style={{ fontFamily: '"Playfair Display", serif' }} className="text-reveal text-2xl md:text-3xl font-bold">
            Looking to Buy or Rent?
          </h2>
          <p className="text-reveal text-sm font-inter text-gray-300">
            Let our experts guide you to the perfect luxury home or commercial space. Get customized property suggestions matches your budget and requirements.
          </p>
          <div className="flex justify-center pt-2">
            <Link
              to="/contact"
              className="btn-gold font-inter font-semibold py-3 px-8 rounded-lg text-sm shadow-md"
              style={{ background: `linear-gradient(135deg, ${GOLD}, #E6C97A)`, color: 'var(--text-primary)' }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Mobile Slide-Out Filter Drawer */}
      <MobileFilterDrawer isOpen={isMobileFilterOpen} onClose={() => setIsMobileFilterOpen(false)}>
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6 dark:border-navy-800 transition-colors duration-300">
          <h2 style={{ fontFamily: '"Playfair Display", serif', color: 'var(--text-primary)', fontWeight: 700 }} className="text-lg">
            Filters
          </h2>
          <button
            onClick={() => setIsMobileFilterOpen(false)}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-navy-300 dark:hover:bg-navy-700 transition-colors duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1">
          <FilterControls />
        </div>
      </MobileFilterDrawer>
    </main>
  );
};

export default PropertiesPage;
