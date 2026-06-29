import React from 'react';
import { useApp } from '@/context/AppContext';
import { Mail, Phone, Calendar, MessageSquare, Building, ChevronDown } from 'lucide-react';

const GOLD = '#C9A84C';

export const AdminEnquiries: React.FC = () => {
  const { enquiries, properties, updateEnquiryStatus } = useApp();
  const [filterMode, setFilterMode] = React.useState<'All' | 'Property' | 'General'>('All');

  const filteredEnquiries = React.useMemo(() => {
    return enquiries.filter(enq => {
      if (filterMode === 'All') return true;
      if (filterMode === 'General') return enq.propertyTitle.startsWith('General Enquiry');
      if (filterMode === 'Property') return !enq.propertyTitle.startsWith('General Enquiry');
      return true;
    });
  }, [enquiries, filterMode]);

  const getPropNumber = (propertyId?: string | number, propertyTitle?: string) => {
    if (propertyId) {
      const found = properties.find((p) => String(p.id) === String(propertyId));
      if (found?.propertyNumber) return found.propertyNumber;
    }
    if (propertyTitle) {
      const found = properties.find((p) => p.title.toLowerCase().trim() === propertyTitle.toLowerCase().trim());
      if (found?.propertyNumber) return found.propertyNumber;
    }
    return '';
  };

  const handleStatusChange = (id: number | string, nextStatus: 'New' | 'Contacted' | 'Closed') => {
    updateEnquiryStatus(id, nextStatus);
  };

  return (
    <div className="space-y-6 text-slate-700 font-inter dark:text-navy-100 transition-colors duration-300">
      
      {/* Description banner */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm dark:bg-navy-900 dark:border-navy-800 transition-colors duration-300">
        <h3 style={{ fontFamily: '"Playfair Display", serif' }} className="text-lg font-bold text-[#0B1120] tracking-wide dark:text-white">
          Customer Enquiries
        </h3>
        <p className="text-xs text-slate-500 font-inter mt-1 dark:text-navy-300">
          Review customer interests, change statuses as you follow up, and manage client communications.
        </p>
      </div>

      {/* Grid or Table */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm p-4 sm:p-0 dark:bg-navy-900 dark:border-navy-800 transition-colors duration-300">
        
        {/* Filters */}
        <div className="p-4 sm:px-6 sm:py-5 border-b border-slate-100 dark:border-navy-800 overflow-x-auto scrollbar-thin">
          <div className="flex gap-1.5 bg-slate-100 p-1.5 rounded-xl w-max dark:bg-navy-950">
            <button
              onClick={() => setFilterMode('All')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${filterMode === 'All' ? 'bg-white text-[#0B1120] shadow-sm dark:bg-navy-800 dark:text-white' : 'text-slate-500 hover:text-[#0B1120] dark:text-navy-400 dark:hover:text-white'}`}
            >
              All Enquiries
            </button>
            <button
              onClick={() => setFilterMode('Property')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${filterMode === 'Property' ? 'bg-white text-[#0B1120] shadow-sm dark:bg-navy-800 dark:text-white' : 'text-slate-500 hover:text-[#0B1120] dark:text-navy-400 dark:hover:text-white'}`}
            >
              Property Leads
            </button>
            <button
              onClick={() => setFilterMode('General')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${filterMode === 'General' ? 'bg-white text-[#0B1120] shadow-sm dark:bg-navy-800 dark:text-white' : 'text-slate-500 hover:text-[#0B1120] dark:text-navy-400 dark:hover:text-white'}`}
            >
              General Contact
            </button>
          </div>
        </div>

        {/* Desktop View (Table) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-inter text-slate-600 dark:text-navy-100">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 font-bold uppercase tracking-wider text-slate-400 text-[10px] dark:bg-navy-950 dark:border-navy-800 dark:text-navy-400">
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Client Info</th>
                <th className="py-4 px-6">Property</th>
                <th className="py-4 px-6">Message</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-transparent dark:divide-navy-800">
              {filteredEnquiries.length > 0 ? (
                filteredEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-slate-50/50 transition-colors dark:hover:bg-navy-800/50">
                    <td className="py-4 px-6 text-slate-400 font-semibold align-top whitespace-nowrap dark:text-navy-300">
                      {enq.date}
                    </td>
                    <td className="py-4 px-6 space-y-1 align-top">
                      <div className="font-bold text-[#0B1120] text-sm dark:text-white">{enq.name}</div>
                      <div className="flex flex-col gap-1 text-[10px] text-slate-500 dark:text-navy-300">
                        <a href={`tel:${enq.phone.replace(/\s+/g, '')}`} className="hover:text-gold no-underline text-inherit flex items-center gap-1 font-medium dark:hover:text-white">
                          <Phone className="w-3 h-3 text-slate-400 dark:text-navy-400" />
                          {enq.phone}
                        </a>
                        <a href={`mailto:${enq.email}`} className="hover:text-gold no-underline text-inherit flex items-center gap-1 font-medium dark:hover:text-white">
                          <Mail className="w-3 h-3 text-slate-400 dark:text-navy-400" />
                          {enq.email}
                        </a>
                      </div>
                    </td>
                    <td className="py-4 px-6 align-top max-w-[150px]">
                      <div className="flex flex-col gap-0.5">
                        {getPropNumber(enq.propertyId, enq.propertyTitle) && (
                          <span className="text-[9px] font-bold text-gold uppercase tracking-wider">
                            {getPropNumber(enq.propertyId, enq.propertyTitle)}
                          </span>
                        )}
                        <span className="font-bold text-slate-700 truncate dark:text-navy-100" title={enq.propertyTitle}>
                          {enq.propertyTitle}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-500 leading-relaxed align-top max-w-sm whitespace-pre-line font-medium dark:text-navy-300">
                      {enq.message}
                    </td>
                    <td className="py-4 px-6 align-top">
                      <div className="relative inline-block w-36">
                        <select
                          value={enq.status}
                          onChange={(e) => handleStatusChange(enq.id, e.target.value as any)}
                          className={`w-full border rounded-lg py-1.5 px-3 pr-8 text-xs font-semibold appearance-none focus:outline-none transition-all cursor-pointer ${
                            enq.status === 'New'
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30'
                              : enq.status === 'Contacted'
                              ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30'
                              : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-navy-800 dark:text-navy-300 dark:border-navy-700'
                          }`}
                        >
                          <option value="New" className="bg-white text-emerald-700 dark:bg-navy-900 dark:text-emerald-400">New</option>
                          <option value="Contacted" className="bg-white text-blue-700 dark:bg-navy-900 dark:text-blue-400">Contacted</option>
                          <option value="Closed" className="bg-white text-slate-500 dark:bg-navy-900 dark:text-slate-300">Closed</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-slate-400 pointer-events-none dark:text-navy-400" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 dark:text-navy-400">
                    No client enquiries received yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View (Cards) */}
        <div className="md:hidden divide-y divide-slate-100 dark:divide-navy-800">
          {filteredEnquiries.length > 0 ? (
            filteredEnquiries.map((enq) => (
              <div key={enq.id} className="p-4 space-y-3 bg-white dark:bg-navy-900 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold dark:text-navy-300">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-navy-400" />
                    <span>{enq.date}</span>
                  </div>
                  
                  {/* Status selector */}
                  <div className="relative inline-block w-28">
                    <select
                      value={enq.status}
                      onChange={(e) => handleStatusChange(enq.id, e.target.value as any)}
                      className={`w-full border rounded-md py-1 px-2.5 pr-6 text-[11px] font-semibold appearance-none focus:outline-none cursor-pointer transition-all ${
                        enq.status === 'New'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30'
                          : enq.status === 'Contacted'
                          ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30'
                          : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-navy-800 dark:text-navy-300 dark:border-navy-700'
                      }`}
                    >
                      <option value="New" className="bg-white text-emerald-700 dark:bg-navy-900 dark:text-emerald-400">New</option>
                      <option value="Contacted" className="bg-white text-blue-700 dark:bg-navy-900 dark:text-blue-400">Contacted</option>
                      <option value="Closed" className="bg-white text-slate-500 dark:bg-navy-900 dark:text-slate-300">Closed</option>
                    </select>
                    <ChevronDown className="w-3 h-3 absolute right-1.5 top-2 text-slate-450 pointer-events-none dark:text-navy-400" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold text-[#0B1120] dark:text-white">{enq.name}</h4>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-500 dark:text-navy-300">
                    <a href={`tel:${enq.phone.replace(/\s+/g, '')}`} className="no-underline text-inherit flex items-center gap-1 font-semibold dark:hover:text-white">
                      <Phone className="w-3 h-3 text-slate-400 dark:text-navy-400" />
                      {enq.phone}
                    </a>
                    <a href={`mailto:${enq.email}`} className="no-underline text-inherit flex items-center gap-1 font-semibold dark:hover:text-white">
                      <Mail className="w-3 h-3 text-slate-400 dark:text-navy-400" />
                      {enq.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold bg-slate-50 p-2 rounded-lg border border-slate-100 dark:bg-navy-800 dark:border-navy-700 dark:text-navy-200">
                  <Building className="w-3.5 h-3.5 text-gold flex-shrink-0" style={{ color: GOLD }} />
                  <div className="flex flex-col leading-tight min-w-0">
                    {getPropNumber(enq.propertyId, enq.propertyTitle) && (
                      <span className="text-[8px] font-bold text-gold uppercase tracking-wider">
                        {getPropNumber(enq.propertyId, enq.propertyTitle)}
                      </span>
                    )}
                    <span className="truncate">{enq.propertyTitle}</span>
                  </div>
                </div>

                <div className="space-y-1 text-[11px] bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 dark:bg-navy-800/50 dark:border-navy-700/50">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wide dark:text-navy-400">
                    <MessageSquare className="w-3 h-3 text-slate-400 dark:text-navy-400" />
                    <span>Message:</span>
                  </div>
                  <p className="text-slate-550 leading-relaxed whitespace-pre-line italic dark:text-navy-300">
                    "{enq.message}"
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-slate-400 dark:text-navy-400">
              No client enquiries received yet.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default AdminEnquiries;
