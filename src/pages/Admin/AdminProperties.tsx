import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Plus, Eye, AlertTriangle, Search, SlidersHorizontal, Building2, FileText, AlertCircle, MapPin, X } from 'lucide-react';

const GOLD = '#C9A84C';
const NAVY = '#0B1120';

export const AdminProperties: React.FC = () => {
  const { properties, enquiries, updateProperty, deleteProperty } = useApp();

  // Search query state
  const [searchQuery, setSearchQuery] = useState('');

  // Active Filters state
  const [filterType, setFilterType] = useState('All');
  const [filterPurpose, setFilterPurpose] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Draft Filters state (unapplied filters)
  const [draftType, setDraftType] = useState('All');
  const [draftPurpose, setDraftPurpose] = useState('All');
  const [draftStatus, setDraftStatus] = useState('All');

  // Filters UI State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Delete modal confirmation state
  const [deleteTargetId, setDeleteTargetId] = useState<number | string | null>(null);

  // Extract unique types from properties
  const uniqueTypes = useMemo(() => {
    const ts = new Set(properties.map((p) => p.type));
    return Array.from(ts);
  }, [properties]);

  // Metrics calculations
  const stats = useMemo(() => {
    const total = properties.length;
    const published = properties.filter((p) => p.showOnWebsite).length;
    const hidden = total - published;
    const totalEnquiries = enquiries.length;
    return { total, published, hidden, totalEnquiries };
  }, [properties, enquiries]);

  // Client side filtering
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      // 1. Search Query filter
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matchesSearch = (
          prop.title.toLowerCase().includes(q) ||
          prop.location.toLowerCase().includes(q) ||
          prop.type.toLowerCase().includes(q) ||
          (prop.propertyNumber && prop.propertyNumber.toLowerCase().includes(q))
        );
        if (!matchesSearch) return false;
      }

      // 2. Property Type filter
      if (filterType !== 'All' && prop.type !== filterType) {
        return false;
      }

      // 3. Listing Type / Purpose filter
      if (filterPurpose !== 'All' && prop.badge !== filterPurpose) {
        return false;
      }

      // 4. Website Visibility filter
      if (filterStatus !== 'All') {
        const isVisible = prop.showOnWebsite;
        if (filterStatus === 'Visible' && !isVisible) return false;
        if (filterStatus === 'Hidden' && isVisible) return false;
      }

      return true;
    });
  }, [properties, searchQuery, filterType, filterPurpose, filterStatus]);

  // Sync draft filters with active filters when the overlay opens
  useEffect(() => {
    if (isFilterOpen) {
      setDraftType(filterType);
      setDraftPurpose(filterPurpose);
      setDraftStatus(filterStatus);
    }
  }, [isFilterOpen, filterType, filterPurpose, filterStatus]);

  // Click outside and keydown (Escape) handlers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isFilterOpen]);

  // Count unapplied changes
  const pendingChangesCount = useMemo(() => {
    let count = 0;
    if (draftType !== filterType) count++;
    if (draftPurpose !== filterPurpose) count++;
    if (draftStatus !== filterStatus) count++;
    return count;
  }, [draftType, filterType, draftPurpose, filterPurpose, draftStatus, filterStatus]);

  const applyFilters = () => {
    setFilterType(draftType);
    setFilterPurpose(draftPurpose);
    setFilterStatus(draftStatus);
    setIsFilterOpen(false);

    // Smooth scroll to results
    const element = document.getElementById('admin-properties-table-container');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const clearFilters = () => {
    setDraftType('All');
    setDraftPurpose('All');
    setDraftStatus('All');
    setFilterType('All');
    setFilterPurpose('All');
    setFilterStatus('All');
    setIsFilterOpen(false);
  };

  // Toggle handlers
  const handleToggleShowOnWebsite = (id: number | string) => {
    const prop = properties.find((p) => p.id === id);
    if (prop) {
      updateProperty({
        ...prop,
        showOnWebsite: !prop.showOnWebsite,
      });
    }
  };

  const confirmDelete = (id: number | string) => {
    setDeleteTargetId(id);
  };

  const executeDelete = () => {
    if (deleteTargetId !== null) {
      deleteProperty(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-6 text-slate-700 font-inter dark:text-navy-100 transition-colors duration-300">
      
      {/* Title & Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-4">
          <h1 style={{ fontFamily: '"Playfair Display", serif' }} className="text-2xl sm:text-3xl font-bold tracking-wide text-[#0B1120] dark:text-white">
            Properties
          </h1>
          <Link
            to="/admin/properties/new"
            className="inline-flex py-2.5 px-5 rounded-lg text-xs font-bold items-center justify-center gap-1.5 shadow-sm no-underline text-white bg-[#0B1120] hover:opacity-95 transition-opacity cursor-pointer dark:bg-gold dark:text-navy-900 dark:hover:bg-gold-light"
          >
            <Plus className="w-4 h-4" />
            Add New Property
          </Link>
        </div>

        <div className="relative flex items-center gap-2 self-end sm:self-auto w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-3 pr-10 text-xs font-medium text-slate-805 placeholder-slate-400 focus:outline-none focus:border-slate-400 dark:bg-navy-950 dark:border-navy-700 dark:text-white dark:focus:border-gold transition-colors"
            />
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400 dark:text-navy-400" />
          </div>

          {/* Filters Button Wrapper with Click Outside Ref */}
          <div className="relative flex items-center" ref={filterRef}>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center justify-center gap-1.5 border rounded-lg py-2 px-3 text-xs font-semibold transition-all cursor-pointer ${
                isFilterOpen 
                  ? 'border-[#0B1120] bg-slate-50 text-[#0B1120] font-bold shadow-xs dark:border-navy-500 dark:bg-navy-800 dark:text-white' 
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 dark:bg-navy-900 dark:border-navy-700 dark:text-navy-200 dark:hover:bg-navy-800'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
              {(filterType !== 'All' || filterPurpose !== 'All' || filterStatus !== 'All') && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse ml-0.5" />
              )}
            </button>

            {/* Filters Dropdown Overlay */}
            {isFilterOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-2rem)] bg-white border border-slate-100 rounded-xl p-4 shadow-lg z-20 space-y-4 font-inter text-xs text-slate-700 animate-in fade-in slide-in-from-top-2 duration-150 dark:bg-navy-900 dark:border-navy-700 dark:text-navy-100">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-navy-800">
                  <span className="font-bold text-slate-800 dark:text-white">Filter Listings</span>
                  <div className="flex items-center gap-2">
                    {(draftType !== 'All' || draftPurpose !== 'All' || draftStatus !== 'All') && (
                      <button 
                        onClick={() => {
                          setDraftType('All');
                          setDraftPurpose('All');
                          setDraftStatus('All');
                        }}
                        className="text-[10px] font-bold text-amber-600 hover:underline cursor-pointer dark:text-amber-500"
                      >
                        Clear Drafts
                      </button>
                    )}
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer flex items-center justify-center dark:hover:bg-navy-800 dark:hover:text-white"
                      title="Close"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                
                {/* Filter 1: Purpose */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider dark:text-navy-300">Listing Type</label>
                  <select
                    value={draftPurpose}
                    onChange={(e) => setDraftPurpose(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2.5 text-xs text-slate-705 focus:outline-none focus:border-slate-400 focus:bg-white dark:bg-navy-950 dark:border-navy-800 dark:text-white dark:focus:border-gold transition-colors"
                  >
                    <option value="All">All Listings</option>
                    <option value="FOR SALE">For Sale</option>
                    <option value="FOR RENT">For Rent</option>
                  </select>
                </div>

                {/* Filter 2: Property Type */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider dark:text-navy-300">Property Type</label>
                  <select
                    value={draftType}
                    onChange={(e) => setDraftType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2.5 text-xs text-slate-705 focus:outline-none focus:border-slate-400 focus:bg-white dark:bg-navy-950 dark:border-navy-800 dark:text-white dark:focus:border-gold transition-colors"
                  >
                    <option value="All">All Types</option>
                    {uniqueTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Filter 3: Website Visibility */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider dark:text-navy-300">Website Visibility</label>
                  <select
                    value={draftStatus}
                    onChange={(e) => setDraftStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2.5 text-xs text-slate-705 focus:outline-none focus:border-slate-400 focus:bg-white dark:bg-navy-950 dark:border-navy-800 dark:text-white dark:focus:border-gold transition-colors"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Visible">Visible on Website</option>
                    <option value="Hidden">Hidden from Website</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-navy-800">
                  <button
                    onClick={applyFilters}
                    className="w-full py-2 text-xs font-semibold rounded-lg text-white font-inter transition-all shadow-xs flex items-center justify-center cursor-pointer bg-[#0B1120] hover:bg-[#C9A84C] hover:text-[#0B1120] dark:bg-gold dark:text-navy-900 dark:hover:opacity-90"
                  >
                    Apply Filters
                    {pendingChangesCount > 0 && ` • ${pendingChangesCount} Change${pendingChangesCount > 1 ? 's' : ''}`}
                  </button>
                  <button
                    onClick={clearFilters}
                    className="w-full py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 font-inter transition-all cursor-pointer dark:border-navy-700 dark:text-navy-300 dark:hover:bg-navy-800 dark:hover:text-white"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Count & Shortcut Actions */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1 py-1">
        <div>
          {filteredProperties.length === properties.length ? (
            <span>Showing all {properties.length} properties</span>
          ) : (
            <span>
              Showing {filteredProperties.length} of {properties.length} properties 
              {(filterType !== 'All' || filterPurpose !== 'All' || filterStatus !== 'All') && ' (filtered)'}
            </span>
          )}
        </div>
        {(filterType !== 'All' || filterPurpose !== 'All' || filterStatus !== 'All') && (
          <button 
            onClick={clearFilters}
            className="text-[10px] font-bold text-amber-600 hover:underline cursor-pointer flex items-center gap-1"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Main Table / Mobile Cards */}
      <div id="admin-properties-table-container" className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm dark:bg-navy-900 dark:border-navy-800 transition-colors duration-300">
        
        {/* Desktop View (Table) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs text-slate-700 dark:text-navy-100">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 font-bold uppercase tracking-wider text-slate-400 text-[10px] dark:bg-navy-950 dark:border-navy-800 dark:text-navy-400">
                <th className="py-4 px-6">Image</th>
                <th className="py-4 px-6">Property Title</th>
                <th className="py-4 px-6">Location</th>
                <th className="py-4 px-6">Type</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center">Show on Website</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-transparent dark:divide-navy-800">
              {filteredProperties.length > 0 ? (
                filteredProperties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-slate-50/50 transition-colors dark:hover:bg-navy-800/50">
                    {/* Image */}
                    <td className="py-4 px-6">
                      <img src={prop.image} alt={prop.title} className="w-20 h-12 rounded-lg object-cover border border-slate-100 dark:border-navy-700" />
                    </td>

                    {/* Property Title Specs */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        {prop.propertyNumber && (
                          <span className="text-[9px] font-bold text-gold uppercase tracking-wider mb-0.5">
                            {prop.propertyNumber}
                          </span>
                        )}
                        <div className="font-bold text-[#0B1120] text-sm truncate max-w-[200px] dark:text-white" title={prop.title}>
                          {prop.title}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 font-medium dark:text-navy-300">
                          {prop.beds || 0} Beds • {prop.baths || 0} Baths • {prop.area}
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-6 text-slate-500 font-medium truncate max-w-[150px] dark:text-navy-300" title={prop.location}>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gold flex-shrink-0" style={{ color: GOLD }} />
                        <span>{prop.location}</span>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-4 px-6 font-semibold text-slate-500 dark:text-navy-300">{prop.type}</td>

                    {/* Price */}
                    <td className="py-4 px-6 text-[#0B1120] font-bold text-sm dark:text-white">{prop.price}</td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30">
                        Published
                      </span>
                    </td>

                    {/* Show on Website Custom Toggle */}
                    <td className="py-4 px-6">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleToggleShowOnWebsite(prop.id)}
                          className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none flex items-center cursor-pointer ${
                            prop.showOnWebsite ? 'bg-[#0B1120] dark:bg-gold' : 'bg-gray-200 dark:bg-navy-700'
                          }`}
                          title={prop.showOnWebsite ? 'Hide from Website' : 'Show on Website'}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out ${
                              prop.showOnWebsite ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/admin/properties/view/${prop.slug || prop.id}`}
                          className="p-2 rounded border border-slate-100 text-slate-450 hover:text-[#0B1120] hover:bg-slate-50 transition-colors dark:border-navy-700 dark:text-navy-300 dark:hover:bg-navy-800 dark:hover:text-white"
                          title="Preview Property"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/admin/upload?edit=${prop.slug || prop.id}`}
                          className="p-2 rounded border border-slate-100 text-slate-450 hover:text-[#0B1120] hover:bg-slate-50 transition-colors dark:border-navy-700 dark:text-navy-300 dark:hover:bg-navy-800 dark:hover:text-white"
                          title="Edit in Dashboard"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => confirmDelete(prop.id)}
                          className="p-2 rounded border border-red-100 text-red-500 hover:text-red-650 hover:bg-red-50/50 transition-colors cursor-pointer dark:border-red-900/30 dark:hover:bg-red-900/20"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-450 dark:text-navy-400">
                    No properties found. Add a property or change filters to see listings.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View (Card List) */}
        <div className="block md:hidden divide-y divide-slate-100 text-xs dark:divide-navy-800">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((prop) => (
              <div key={prop.id} className="p-4 space-y-4">
                <div className="flex items-start gap-3">
                  {/* Thumbnail */}
                  <img src={prop.image} alt={prop.title} className="w-20 h-14 rounded-lg object-cover border border-slate-100 flex-shrink-0 dark:border-navy-700" />
                  
                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[#0B1120] font-bold text-sm dark:text-white">{prop.price}</span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30">
                        Published
                      </span>
                    </div>
                    <div className="mt-1">
                      <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-bold bg-gold/10 text-gold border border-gold/25 uppercase tracking-wide">
                        {prop.propertyNumber}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-[#0B1120] truncate mt-1 dark:text-white">{prop.title}</h4>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5 dark:text-navy-300">{prop.location}</p>
                    <p className="text-[9px] text-slate-500 mt-1 font-semibold dark:text-navy-400">
                      {prop.beds || 0} Beds • {prop.baths || 0} Baths • {prop.area}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-navy-800">
                  {/* Show on website toggle */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider dark:text-navy-300">Show on site:</span>
                    <button
                      onClick={() => handleToggleShowOnWebsite(prop.id)}
                      className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none flex items-center cursor-pointer ${
                        prop.showOnWebsite ? 'bg-[#0B1120] dark:bg-gold' : 'bg-gray-200 dark:bg-navy-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out ${
                          prop.showOnWebsite ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/admin/properties/view/${prop.slug || prop.id}`}
                      className="p-2 rounded border border-slate-150 text-slate-400 hover:text-[#0B1120] dark:border-navy-700 dark:text-navy-300 dark:hover:text-white dark:hover:bg-navy-800"
                      title="Preview Property"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to={`/admin/upload?edit=${prop.slug || prop.id}`}
                      className="p-2 rounded border border-slate-150 text-slate-400 hover:text-[#0B1120] dark:border-navy-700 dark:text-navy-300 dark:hover:text-white dark:hover:bg-navy-800"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => confirmDelete(prop.id)}
                      className="p-2 rounded border border-red-100 text-red-500 hover:text-red-650 cursor-pointer dark:border-red-900/30 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-slate-400 dark:text-navy-400">
              No properties in inventory.
            </div>
          )}
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {deleteTargetId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setDeleteTargetId(null)} />
          
          {/* Modal Container */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 max-w-sm w-full relative z-10 space-y-4 font-inter text-slate-700 shadow-2xl dark:bg-navy-900 dark:border-navy-800">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3 text-red-500 dark:border-navy-800 dark:text-red-400">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <h4 className="font-bold text-sm">Confirm Permanent Delete</h4>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed dark:text-navy-300">
              Are you sure you want to delete this property? This action cannot be undone and it will instantly disappear from all public pages, details, and search indexes.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="py-2 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 transition-all cursor-pointer dark:bg-navy-800 dark:border-navy-700 dark:text-white dark:hover:bg-navy-700"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition-all shadow-sm cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProperties;
