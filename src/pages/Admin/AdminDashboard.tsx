import React, { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Link } from 'react-router-dom';
import { Building2, FileText, CheckCircle, AlertCircle, Eye, Settings, Heart, PlusCircle } from 'lucide-react';

const GOLD = '#C9A84C';

export const AdminDashboard: React.FC = () => {
  const { properties, enquiries } = useApp();

  // Metrics calculations
  const stats = useMemo(() => {
    const totalProps = properties.length;
    const activeProps = properties.filter((p) => p.showOnWebsite).length;
    const featuredProps = properties.filter((p) => p.featured).length;
    
    const totalEnquiries = enquiries.length;
    const newEnquiries = enquiries.filter((e) => e.status === 'New').length;
    const contactedEnquiries = enquiries.filter((e) => e.status === 'Contacted').length;

    return {
      totalProps,
      activeProps,
      featuredProps,
      totalEnquiries,
      newEnquiries,
      contactedEnquiries,
    };
  }, [properties, enquiries]);

  // Take top 5 recent enquiries
  const recentEnquiries = useMemo(() => {
    return enquiries.slice(0, 5);
  }, [enquiries]);

  // Take top 5 recent properties
  const recentProperties = useMemo(() => {
    return properties.slice(0, 5);
  }, [properties]);

  return (
    <div className="space-y-8 text-slate-700 font-inter dark:text-navy-100 transition-colors duration-300">
      {/* Page Title */}
      <div>
        <h1 style={{ fontFamily: '"Playfair Display", serif' }} className="text-2xl sm:text-3xl font-bold tracking-wide text-[#0B1120] dark:text-white">
          Dashboard Overview
        </h1>
        <p className="text-xs text-slate-500 mt-1 dark:text-navy-300">
          Welcome to the control center. Here is the latest performance summary for New Star Real Estate.
        </p>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Properties */}
        <Link to="/admin/properties" className="block bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-gold/30 dark:bg-navy-900 dark:border-navy-800 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block dark:text-navy-300">
                Total Properties
              </span>
              <div className="text-3xl font-extrabold text-[#0B1120] dark:text-white">{stats.totalProps}</div>
              <span className="text-xs text-slate-500 dark:text-navy-400">
                {stats.activeProps} visible on website
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center border border-gold/20 flex-shrink-0 dark:bg-gold/5 dark:border-gold/10">
              <Building2 className="w-5 h-5 text-gold" style={{ color: GOLD }} />
            </div>
          </div>
        </Link>

        {/* Featured Properties */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center justify-between shadow-sm dark:bg-navy-900 dark:border-navy-800 transition-colors duration-300">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block dark:text-navy-300">
              Featured Listings
            </span>
            <div className="text-3xl font-extrabold text-[#0B1120] dark:text-white">{stats.featuredProps}</div>
            <span className="text-xs text-slate-500 dark:text-navy-400">
              Highlighted on home screen
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center border border-red-100 flex-shrink-0 dark:bg-red-900/20 dark:border-red-900/30">
            <Heart className="w-5 h-5 text-red-500" style={{ fill: '#ef4444' }} />
          </div>
        </div>

        {/* Total Enquiries */}
        <Link to="/admin/enquiries" className="block bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-blue-300 dark:bg-navy-900 dark:border-navy-800 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block dark:text-navy-300">
                Total Enquiries
              </span>
              <div className="text-3xl font-extrabold text-[#0B1120] dark:text-white">{stats.totalEnquiries}</div>
              <span className="text-xs text-slate-500 dark:text-navy-400">
                {stats.newEnquiries} pending review
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 flex-shrink-0 dark:bg-blue-900/20 dark:border-blue-900/30">
              <FileText className="w-5 h-5 text-blue-500" />
            </div>
          </div>
        </Link>

        {/* Pending Enquiries */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center justify-between shadow-sm dark:bg-navy-900 dark:border-navy-800 transition-colors duration-300">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block dark:text-navy-300">
              Pending Tasks
            </span>
            <div className="text-3xl font-extrabold text-[#0B1120] dark:text-white">{stats.newEnquiries}</div>
            <span className="text-xs text-slate-500 dark:text-navy-400">
              Requires customer contact
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100 flex-shrink-0 dark:bg-emerald-900/20 dark:border-emerald-900/30">
            <AlertCircle className="w-5 h-5 text-emerald-500" />
          </div>
        </div>

      </div>

      {/* Two Column Layout (Recent items) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Enquiries */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4 shadow-sm dark:bg-navy-900 dark:border-navy-800 transition-colors duration-300">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-navy-800">
            <h3 style={{ fontFamily: '"Playfair Display", serif' }} className="text-base font-bold tracking-wide text-[#0B1120] dark:text-white">
              Recent Enquiries
            </h3>
            <Link to="/admin/enquiries" className="text-xs text-gold hover:text-[#0B1120] dark:hover:text-white no-underline font-semibold uppercase tracking-wider transition-colors">
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-navy-800">
            {recentEnquiries.length > 0 ? (
              recentEnquiries.map((enquiry) => (
                <div key={enquiry.id} className="py-3.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0B1120] dark:text-white">{enquiry.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        enquiry.status === 'New'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30'
                          : enquiry.status === 'Contacted'
                          ? 'bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30'
                          : 'bg-slate-50 text-slate-500 border border-slate-100 dark:bg-navy-800 dark:text-navy-300 dark:border-navy-700'
                      }`}
                    >
                      {enquiry.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-navy-300">
                    <span>{enquiry.propertyTitle}</span>
                    <span>{enquiry.date}</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1 italic dark:text-navy-400">
                    "{enquiry.message}"
                  </p>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-xs text-slate-400 dark:text-navy-400">
                No enquiries received yet.
              </div>
            )}
          </div>
        </div>

        {/* Recently Added Properties */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4 shadow-sm dark:bg-navy-900 dark:border-navy-800 transition-colors duration-300">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-navy-800">
            <h3 style={{ fontFamily: '"Playfair Display", serif' }} className="text-base font-bold tracking-wide text-[#0B1120] dark:text-white">
              Recently Managed Properties
            </h3>
            <div className="flex items-center gap-3">
              <Link to="/admin/properties/new" className="text-xs text-gold hover:text-[#0B1120] dark:hover:text-white no-underline font-semibold uppercase flex items-center gap-1 tracking-wider transition-colors">
                <PlusCircle className="w-3.5 h-3.5" />
                Add New
              </Link>
              <span className="text-slate-200 dark:text-navy-700">|</span>
              <Link to="/admin/properties" className="text-xs text-gold hover:text-[#0B1120] dark:hover:text-white no-underline font-semibold uppercase tracking-wider transition-colors">
                Manage
              </Link>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-navy-800">
            {recentProperties.length > 0 ? (
              recentProperties.map((prop) => (
                <div key={prop.id} className="py-3.5 flex items-center gap-4">
                  {/* Thumbnail */}
                  <img src={prop.image} alt={prop.title} className="w-12 h-12 rounded-lg object-cover bg-slate-50 border border-slate-100 flex-shrink-0 dark:bg-navy-800 dark:border-navy-700" />
                  
                  {/* Title & Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#0B1120] truncate dark:text-white">{prop.title}</h4>
                    <p className="text-[11px] text-slate-400 truncate dark:text-navy-300">{prop.location}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-gold font-bold">{prop.price}</span>
                      <span className="text-[10px] text-slate-300 dark:text-navy-600">•</span>
                      <span className="text-[10px] text-slate-500 font-semibold dark:text-navy-400">{prop.type}</span>
                    </div>
                  </div>

                  {/* Actions/Status */}
                  <div className="text-right flex flex-col items-end gap-1.5">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        prop.showOnWebsite
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30'
                          : 'bg-slate-50 text-slate-500 border border-slate-100 dark:bg-navy-800 dark:text-navy-300 dark:border-navy-700'
                      }`}
                    >
                      {prop.showOnWebsite ? 'Published' : 'Draft'}
                    </span>
                    <Link
                      to={`/admin/properties/edit/${prop.id}`}
                      className="p-1 rounded hover:bg-slate-50 text-slate-400 hover:text-[#0B1120] transition-colors dark:hover:bg-navy-800 dark:hover:text-white"
                      title="Edit Property"
                    >
                      <Settings className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-xs text-slate-400 dark:text-navy-400">
                No properties in inventory.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
