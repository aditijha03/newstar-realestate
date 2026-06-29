import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { 
  MapPin, Bed, Bath, Square, Car, Compass, Sofa, CheckCircle2, ChevronRight, 
  ArrowLeft, ChevronLeft, Send, Phone, Mail, Clock, Calendar, 
  Link2, Share2, Shield, Zap, ArrowUpDown, Video, Sparkles, Wind, UtensilsCrossed,
  ZoomIn, ZoomOut, RotateCcw, X
} from 'lucide-react';

const GOLD = '#C9A84C';
const NAVY = '#0B1120';

const FacebookIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const TwitterIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

export const AdminPropertyView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { properties, updateProperty, enquiries } = useApp();

  // Find active property from context
  const property = useMemo(() => {
    if (!id) return undefined;
    return properties.find((p) => p.id.toString() === id.toString() || p.slug === id);
  }, [properties, id]);

  const propertyEnquiries = useMemo(() => {
    if (!property) return [];
    return enquiries.filter((e) => e.propertyId === property.id.toString());
  }, [enquiries, property]);

  // Gallery Active Image Index
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Share success toast state
  const [showCopiedToast, setShowCopiedToast] = useState(false);



  // Combine cover image and gallery images safely
  const galleryImages = useMemo(() => {
    if (!property) return [];
    const list = [property.image];
    if (property.gallery && property.gallery.length > 0) {
      property.gallery.forEach((img) => {
        if (img !== property.image && img.trim() !== '') {
          list.push(img);
        }
      });
    }
    return list;
  }, [property]);

  // Lightbox / Zoom modal states
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [zoomScale, setZoomScale] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setZoomScale(1);
    setPanPosition({ x: 0, y: 0 });
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoomScale((prev) => Math.min(prev + 0.5, 5));
  };

  const handleZoomOut = () => {
    setZoomScale((prev) => {
      const nextScale = Math.max(prev - 0.5, 1);
      if (nextScale === 1) {
        setPanPosition({ x: 0, y: 0 });
      }
      return nextScale;
    });
  };

  const handleResetZoom = () => {
    setZoomScale(1);
    setPanPosition({ x: 0, y: 0 });
  };

  const handleLightboxPrev = () => {
    setLightboxIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
    handleResetZoom();
  };

  const handleLightboxNext = () => {
    setLightboxIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
    handleResetZoom();
  };

  // Drag handlers (Mouse)
  const handleMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    if (zoomScale <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!isDragging || zoomScale <= 1) return;
    e.preventDefault();
    setPanPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Drag handlers (Touch)
  const handleTouchStart = (e: React.TouchEvent<HTMLImageElement>) => {
    if (zoomScale <= 1 || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX - panPosition.x, y: touch.clientY - panPosition.y });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLImageElement>) => {
    if (!isDragging || zoomScale <= 1 || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setPanPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Keyboard shortcut support
  React.useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        handleLightboxPrev();
      } else if (e.key === 'ArrowRight') {
        handleLightboxNext();
      } else if (e.key === '=' || e.key === '+') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen, zoomScale, lightboxIndex, galleryImages]);

  const handlePrevImage = () => {
    setActiveImgIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImgIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const handleToggleVisibility = async () => {
    if (!property) return;
    const updated = { ...property, showOnWebsite: !property.showOnWebsite };
    await updateProperty(updated);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + `/properties/${property?.slug || property?.id}`);
    setShowCopiedToast(true);
    setTimeout(() => setShowCopiedToast(false), 2000);
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + `/properties/${property?.slug || property?.id}`)}`, '_blank');
  };

  const handleShareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.origin + `/properties/${property?.slug || property?.id}`)}&text=${encodeURIComponent(property?.title || '')}`, '_blank');
  };

  const handleShareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent((property?.title || '') + ' ' + window.location.origin + `/properties/${property?.slug || property?.id}`)}`, '_blank');
  };

  // Map amenities to specific outline icons
  const getAmenityIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('security')) return <Shield className="w-5 h-5" />;
    if (n.includes('power') || n.includes('backup') || n.includes('generator')) return <Zap className="w-5 h-5" />;
    if (n.includes('lift') || n.includes('elevator')) return <ArrowUpDown className="w-5 h-5" />;
    if (n.includes('cctv') || n.includes('camera')) return <Video className="w-5 h-5" />;
    if (n.includes('pool') || n.includes('jacuzzi')) return <Sparkles className="w-5 h-5" />;
    if (n.includes('ventil') || n.includes('air')) return <Wind className="w-5 h-5" />;
    if (n.includes('kitchen')) return <UtensilsCrossed className="w-5 h-5" />;
    return <CheckCircle2 className="w-5 h-5" />;
  };

  // Redirect if property doesn't exist
  if (!property) {
    return (
      <main className="flex-1 p-8 flex items-center justify-center dark:bg-navy-950 transition-colors duration-300">
        <div className="text-center space-y-4 max-w-md px-4">
          <h1 style={{ fontFamily: '"Playfair Display", serif', color: 'var(--text-primary)' }} className="text-3xl font-bold">
            Property Not Found
          </h1>
          <p className="text-sm font-inter text-gray-500 dark:text-navy-200 transition-colors duration-300">
            This property does not exist or has been permanently deleted.
          </p>
          <button
            onClick={() => navigate('/admin')}
            className="btn-navy flex items-center justify-center gap-2 mx-auto py-2.5 px-6 rounded-lg text-xs font-semibold font-inter text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="flex-1 p-4 lg:p-8 font-inter dark:bg-navy-950 transition-colors duration-300">
      
      {/* Breadcrumbs Section */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 py-3 sm:py-4 px-4 sm:px-6 flex items-center justify-between gap-4 mb-6 dark:bg-navy-900 dark:border-navy-800 transition-colors duration-300">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-gray-500 uppercase min-w-0 dark:text-navy-200 transition-colors duration-300">
          <Link to="/admin" className="hover:text-navy transition-colors no-underline text-inherit flex-shrink-0">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: GOLD }} />
          <span className="text-navy truncate max-w-[120px] sm:max-w-xs dark:text-white transition-colors duration-300">{property.title}</span>
        </div>

        <Link
          to="/admin"
          className="flex items-center gap-1 text-[11px] font-semibold text-gray-600 hover:text-navy no-underline transition-colors flex-shrink-0 dark:text-navy-100"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Back</span>
        </Link>
      </section>

      {/* Main Grid Content */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          
          {/* LEFT 2 COLUMNS: Media gallery, description, details, highlights, amenities */}
          <div className="contents lg:block lg:col-span-2 lg:space-y-8">
            
            {/* Gallery Card */}
            <div className="bg-white rounded-2xl p-2 sm:p-4 shadow-sm border border-gray-100 space-y-3 order-1 lg:order-none dark:bg-navy-900 dark:border-navy-800 transition-colors duration-300">
              {/* Main Cover Image Viewport */}
              <div className="relative h-64 xs:h-72 sm:h-[380px] lg:h-[390px] bg-slate-900 rounded-xl overflow-hidden group">
                <img
                  src={galleryImages[activeImgIndex]}
                  alt={`${property.title} - Cover`}
                  className="w-full h-full object-cover select-none cursor-zoom-in"
                  style={{ height: '100%', objectFit: 'cover' }}
                  onClick={() => openLightbox(activeImgIndex)}
                />
                
                {/* Arrow Nav Overlay */}
                {galleryImages.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-white/90 text-navy hover:bg-white hover:scale-105 shadow-sm transition-all focus:outline-none dark:text-white"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[2.5]" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-white/90 text-navy hover:bg-white hover:scale-105 shadow-sm transition-all focus:outline-none dark:text-white"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[2.5]" />
                    </button>
                  </>
                )}

                {/* Cover Badges */}
                <span
                  className="absolute top-4 left-4 px-3 py-1.5 text-[10px] font-bold rounded uppercase tracking-wider text-white"
                  style={{
                    background: property.badge === 'FOR RENT' ? '#2563eb' : 'linear-gradient(135deg, #C9A84C, #E6C97A)',
                    color: property.badge === 'FOR RENT' ? '#fff' : NAVY,
                  }}
                >
                  {property.badge === 'FOR RENT' ? 'FOR RENT' : 'FOR SALE'}
                </span>


                {/* Counter overlay */}
                <div className="absolute bottom-4 right-4 bg-black/60 text-white font-inter text-[10px] font-bold py-1 px-3 rounded-full backdrop-blur-xs select-none">
                  {activeImgIndex + 1} / {galleryImages.length}
                </div>
              </div>

              {/* Thumbnails strip list */}
              {galleryImages.length > 1 && (
                <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1.5 scrollbar-thin">
                  {galleryImages.map((img, idx) => {
                    const isVideoPlaceholder = idx === 0 && property.title.toLowerCase().includes('apartment'); // First thumb gets play overlay for mock reference
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveImgIndex(idx)}
                        className={`flex-shrink-0 w-20 sm:w-24 h-14 sm:h-16 rounded-lg overflow-hidden border-2 transition-all relative ${
                          activeImgIndex === idx ? 'border-gold' : 'border-transparent hover:border-gray-200'
                        }`}
                        style={{ borderColor: activeImgIndex === idx ? GOLD : 'transparent' }}
                      >
                        <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                        
                        {/* Mock video icon overlay for the first item matching the reference screenshot */}
                        {isVideoPlaceholder && (
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <div className="w-6 h-6 rounded-full bg-white/95 flex items-center justify-center shadow-xs">
                              <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[7px] border-l-navy ml-0.5" />
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* About This Property */}
            <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm border border-gray-100 space-y-4 sm:space-y-6 order-3 lg:order-none dark:bg-navy-900 dark:border-navy-800 transition-colors duration-300">
              <div className="space-y-3">
                <h3 style={{ fontFamily: '"Playfair Display", serif', color: 'var(--text-primary)' }} className="text-xl sm:text-2xl font-bold">
                  About This Property
                </h3>
                <p className="text-sm font-inter text-gray-500 leading-relaxed dark:text-navy-200 transition-colors duration-300">
                  {property.description}
                </p>
              </div>

              {/* Inner highlight grid cards (4 columns or stack depending on screen size) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100 dark:border-navy-800 transition-colors duration-300">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 text-gold flex-shrink-0 dark:bg-navy-950 dark:border-navy-800 transition-colors duration-300" style={{ color: GOLD }}>
                    <Sofa className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-navy text-[11px] sm:text-xs leading-none dark:text-white transition-colors duration-300">Spacious Living</h5>
                    <span className="text-[10px] text-gray-400 font-medium dark:text-navy-300 transition-colors duration-300">& Dining Area</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 text-gold flex-shrink-0 dark:bg-navy-950 dark:border-navy-800 transition-colors duration-300" style={{ color: GOLD }}>
                    <UtensilsCrossed className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-navy text-[11px] sm:text-xs leading-none dark:text-white transition-colors duration-300">Modern Modular</h5>
                    <span className="text-[10px] text-gray-400 font-medium dark:text-navy-300 transition-colors duration-300">Kitchen</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 text-gold flex-shrink-0 dark:bg-navy-950 dark:border-navy-800 transition-colors duration-300" style={{ color: GOLD }}>
                    <Sparkles className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-navy text-[11px] sm:text-xs leading-none dark:text-white transition-colors duration-300">Premium</h5>
                    <span className="text-[10px] text-gray-400 font-medium dark:text-navy-300 transition-colors duration-300">Fittings</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 text-gold flex-shrink-0 dark:bg-navy-950 dark:border-navy-800 transition-colors duration-300" style={{ color: GOLD }}>
                    <Wind className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-navy text-[11px] sm:text-xs leading-none dark:text-white transition-colors duration-300">Well Ventilated</h5>
                    <span className="text-[10px] text-gray-400 font-medium dark:text-navy-300 transition-colors duration-300">Rooms</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities Section */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm border border-gray-100 space-y-4 sm:space-y-6 order-4 lg:order-none dark:bg-navy-900 dark:border-navy-800 transition-colors duration-300">
                <h3 style={{ fontFamily: '"Playfair Display", serif', color: 'var(--text-primary)' }} className="text-xl sm:text-2xl font-bold">
                  Amenities
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-4">
                  {property.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center space-y-2">
                      <div className="w-11 h-11 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-navy shadow-xs flex-shrink-0 dark:bg-navy-800 dark:border-navy-700 dark:text-white transition-colors duration-300">
                        {getAmenityIcon(amenity)}
                      </div>
                      <span className="text-[11px] font-semibold text-gray-600 font-inter dark:text-navy-100 transition-colors duration-300">
                        {amenity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: Info Box, Schedule, Share box, Enquiry box */}
          <div className="contents lg:block lg:space-y-8">
            
            {/* Property details sidebar card */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm sm:shadow-md border border-gray-100 space-y-5 sm:space-y-6 order-2 lg:order-none dark:bg-navy-900 dark:border-navy-800 transition-colors duration-300">
              
              {/* Header Titles */}
              <div className="space-y-2">
                <h1 
                  style={{ 
                    fontFamily: '"Playfair Display", serif', 
                    color: 'var(--text-primary)',
                    fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
                    lineHeight: '1.2',
                    fontWeight: 700
                  }} 
                  className="tracking-wide"
                >
                  {property.title}
                </h1>
                
                <p className="flex items-center gap-1.5 text-xs text-gray-400 font-inter dark:text-navy-300 transition-colors duration-300">
                  <MapPin className="w-4 h-4 text-gold flex-shrink-0" style={{ color: GOLD }} />
                  {property.location}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-1.5 pt-4 sm:pt-5 border-t border-gray-100 dark:border-navy-800 transition-colors duration-300">
                <span style={{ fontFamily: '"Playfair Display", serif', color: GOLD }} className="text-2xl sm:text-3xl font-extrabold whitespace-nowrap">
                  {property.price ? property.price.split(' ')[0] : ''} {property.price && property.price.includes(' ') ? property.price.split(' ')[1] : ''}
                </span>
                {property.price && property.price.includes('/') ? (
                  <span className="text-xs text-gray-400 font-medium whitespace-nowrap dark:text-navy-300 transition-colors duration-300">/ Month</span>
                ) : (
                  <span className="text-xs text-gray-400 font-medium whitespace-nowrap dark:text-navy-300 transition-colors duration-300">(Negotiable)</span>
                )}
              </div>

              {/* Specs circular icon grid (3 col layout matching screenshot) */}
              <div className="grid grid-cols-3 gap-y-5 sm:gap-y-6 gap-x-2 pt-5 sm:pt-6 border-t border-gray-100 text-center font-inter dark:border-navy-800 transition-colors duration-300">
                
                {/* Bedrooms */}
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-navy dark:bg-navy-800 dark:border-navy-700 dark:text-white transition-colors duration-300">
                    <Bed className="w-4.5 h-4.5 text-slate-500" />
                  </div>
                  <span className="text-xs font-bold text-navy mt-2.5 block leading-none dark:text-white transition-colors duration-300">{property.beds || '—'}</span>
                  <span className="text-[10px] text-gray-400 font-medium mt-1 dark:text-navy-300 transition-colors duration-300">Bedrooms</span>
                </div>

                {/* Bathrooms */}
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-navy dark:bg-navy-800 dark:border-navy-700 dark:text-white transition-colors duration-300">
                    <Bath className="w-4.5 h-4.5 text-slate-500" />
                  </div>
                  <span className="text-xs font-bold text-navy mt-2.5 block leading-none dark:text-white transition-colors duration-300">{property.baths || '—'}</span>
                  <span className="text-[10px] text-gray-400 font-medium mt-1 dark:text-navy-300 transition-colors duration-300">Bathrooms</span>
                </div>

                {/* Sq. Ft */}
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-navy dark:bg-navy-800 dark:border-navy-700 dark:text-white transition-colors duration-300">
                    <Square className="w-4.5 h-4.5 text-slate-500" />
                  </div>
                  <span className="text-xs font-bold text-navy mt-2.5 block leading-none dark:text-white transition-colors duration-300">{property.area ? property.area.split(' ')[0] : '—'}</span>
                  <span className="text-[10px] text-gray-400 font-medium mt-1 dark:text-navy-300 transition-colors duration-300">Sq. Ft.</span>
                </div>

                {/* Balconies */}
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-navy dark:bg-navy-800 dark:border-navy-700 dark:text-white transition-colors duration-300">
                    <Compass className="w-4.5 h-4.5 text-slate-500" />
                  </div>
                  <span className="text-xs font-bold text-navy mt-2.5 block leading-none dark:text-white transition-colors duration-300">{property.balconies ?? 2}</span>
                  <span className="text-[10px] text-gray-400 font-medium mt-1 dark:text-navy-300 transition-colors duration-300">Balconies</span>
                </div>

                {/* Parking */}
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-navy dark:bg-navy-800 dark:border-navy-700 dark:text-white transition-colors duration-300">
                    <Car className="w-4.5 h-4.5 text-slate-500" />
                  </div>
                  <span className="text-xs font-bold text-navy mt-2.5 block leading-none dark:text-white transition-colors duration-300">{property.parking ?? 1}</span>
                  <span className="text-[10px] text-gray-400 font-medium mt-1 dark:text-navy-300 transition-colors duration-300">Car Parking</span>
                </div>

                {/* Property Type */}
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-navy dark:bg-navy-800 dark:border-navy-700 dark:text-white transition-colors duration-300">
                    <Sofa className="w-4.5 h-4.5 text-slate-500" />
                  </div>
                  <span className="text-xs font-bold text-navy mt-2.5 block leading-none text-ellipsis overflow-hidden whitespace-nowrap max-w-full dark:text-white transition-colors duration-300">
                    {property.type}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium mt-1 dark:text-navy-300 transition-colors duration-300">Property Type</span>
                </div>

              </div>

            {/* Share Property Box */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 space-y-4 lg:order-none dark:bg-navy-900 dark:border-navy-800 transition-colors duration-300">
              <h4 style={{ fontFamily: '"Playfair Display", serif', color: 'var(--text-primary)' }} className="font-bold text-base">
                Share Property
              </h4>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleShareFacebook}
                  className="w-10 h-10 rounded-full border border-gray-100 bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors dark:border-navy-800 dark:bg-navy-950 dark:hover:bg-navy-700"
                  aria-label="Share on Facebook"
                >
                  <FacebookIcon className="w-4 h-4 text-blue-600" />
                </button>
                <button
                  onClick={handleShareWhatsApp}
                  className="w-10 h-10 rounded-full border border-gray-100 bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors dark:border-navy-800 dark:bg-navy-950 dark:hover:bg-navy-700"
                  aria-label="Share on WhatsApp"
                >
                  <svg className="w-4 h-4 text-green-500 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.59 1.967 14.11 1.011 11.99 1.013c-5.437 0-9.862 4.371-9.866 9.8.001 2.029.5 4.02 1.488 5.76l-.985 3.593 3.69-.958zm12.39-7.143c-.267-.134-1.586-.783-1.832-.873-.247-.09-.427-.134-.607.134-.18.269-.696.873-.853 1.05-.157.177-.315.197-.582.063-.267-.134-1.13-.417-2.153-1.328-.795-.71-1.332-1.588-1.488-1.854-.157-.267-.017-.41.116-.543.12-.12.267-.314.402-.471.133-.156.178-.268.267-.446.088-.178.044-.334-.022-.468-.066-.134-.607-1.463-.83-2.006-.217-.521-.456-.45-.607-.458-.156-.008-.336-.009-.516-.009-.18 0-.472.067-.719.336-.247.269-.944.922-.944 2.247 0 1.325.964 2.607 1.098 2.787.135.18 1.897 2.897 4.594 4.06.642.278 1.143.444 1.534.568.647.206 1.237.177 1.703.107.519-.078 1.587-.648 1.81-.1.222-.519.222-.962 0-1.05-.067-.09-.247-.134-.513-.269z"/>
                  </svg>
                </button>
                <button
                  onClick={handleShareTwitter}
                  className="w-10 h-10 rounded-full border border-gray-100 bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors dark:border-navy-800 dark:bg-navy-950 dark:hover:bg-navy-700"
                  aria-label="Share on Twitter"
                >
                  <TwitterIcon className="w-4 h-4 text-sky-500" />
                </button>
                <button
                  onClick={handleCopyLink}
                  className="w-10 h-10 rounded-full border border-gray-100 bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors dark:border-navy-800 dark:bg-navy-950 dark:hover:bg-navy-700"
                  aria-label="Copy Link"
                >
                  <Link2 className="w-4 h-4 text-slate-600" />
                </button>
              </div>

              {showCopiedToast && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[10px] font-bold py-1.5 px-3 rounded-lg text-center font-inter transition-all">
                  Link copied to clipboard!
                </div>
              )}
            </div>

            {/* Admin Controls Box */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 space-y-4 lg:order-none dark:bg-navy-900 dark:border-navy-800 transition-colors duration-300">
              <h4 style={{ fontFamily: '"Playfair Display", serif', color: 'var(--text-primary)' }} className="font-bold text-base">
                Admin Controls
              </h4>

              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/admin/upload?edit=${property.slug || property.id}`)}
                  className="w-full py-3 bg-navy text-white rounded-lg text-xs font-semibold tracking-wider flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all dark:bg-navy-800"
                >
                  Edit Property
                </button>

                <button
                  onClick={handleToggleVisibility}
                  className={`w-full py-3 rounded-lg text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-all border ${
                    property.showOnWebsite
                      ? 'border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20'
                      : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900/50 dark:text-emerald-400 dark:hover:bg-emerald-900/20'
                  }`}
                >
                  {property.showOnWebsite ? 'Hide from Website' : 'Show on Website'}
                </button>

                <Link
                  to={`/properties/${property.slug || property.id}`}
                  target="_blank"
                  className="w-full py-3 bg-slate-50 border border-slate-200 text-navy rounded-lg text-xs font-semibold tracking-wider flex items-center justify-center gap-2 hover:bg-slate-100 transition-all dark:bg-navy-950 dark:border-navy-700 dark:text-white dark:hover:bg-navy-800 no-underline"
                >
                  <Link2 className="w-4 h-4" />
                  View Public Page
                </Link>
              </div>
            </div>

            {/* Property Enquiries Box */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 space-y-4 lg:order-none dark:bg-navy-900 dark:border-navy-800 transition-colors duration-300">
              <div className="flex items-center justify-between mb-4">
                <h4 style={{ fontFamily: '"Playfair Display", serif', color: 'var(--text-primary)' }} className="font-bold text-base">
                  Recent Enquiries
                </h4>
                <span className="bg-navy-100 text-navy text-[10px] font-bold px-2.5 py-1 rounded-full dark:bg-navy-800 dark:text-white">
                  {propertyEnquiries.length}
                </span>
              </div>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                {propertyEnquiries.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4 italic dark:text-navy-300">
                    No enquiries for this property yet.
                  </p>
                ) : (
                  propertyEnquiries.map((enq) => (
                    <div key={enq.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-3 dark:border-navy-700 dark:bg-navy-800/50">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-navy dark:text-white">{enq.name}</span>
                        <span className="text-[10px] text-gray-400 dark:text-navy-300">
                          {new Date(enq.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        <a href={`tel:${enq.phone}`} className="flex items-center gap-2 text-xs text-gray-600 hover:text-gold dark:text-navy-200 transition-colors">
                          <Phone className="w-3.5 h-3.5" />
                          {enq.phone}
                        </a>
                        <a href={`mailto:${enq.email}`} className="flex items-center gap-2 text-xs text-gray-600 hover:text-gold dark:text-navy-200 transition-colors">
                          <Mail className="w-3.5 h-3.5" />
                          {enq.email}
                        </a>
                      </div>
                      {enq.message && (
                        <div className="pt-3 border-t border-gray-100 dark:border-navy-700">
                          <p className="text-xs text-gray-500 leading-relaxed dark:text-navy-300">"{enq.message}"</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div></div>

          </div>

        </div>
      </section>

      {/* Lightbox / Image Zoom Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between select-none font-inter text-white">
          {/* Header Bar */}
          <div className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 to-transparent">
            {/* Title / Counter info */}
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Viewing Photo
              </span>
              <p className="text-sm font-semibold truncate max-w-xs sm:max-w-md">
                {property.title} — {lightboxIndex + 1} of {galleryImages.length}
              </p>
            </div>

            {/* Toolbar Buttons */}
            <div className="flex items-center gap-3">
              {/* Zoom Out */}
              <button
                onClick={handleZoomOut}
                disabled={zoomScale <= 1}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-40 disabled:hover:bg-white/5 transition-all focus:outline-none border border-white/5 cursor-pointer"
                title="Zoom Out (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              {/* Zoom Percentage */}
              <span className="text-xs font-bold font-mono min-w-[45px] text-center">
                {Math.round(zoomScale * 100)}%
              </span>

              {/* Zoom In */}
              <button
                onClick={handleZoomIn}
                disabled={zoomScale >= 5}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-40 disabled:hover:bg-white/5 transition-all focus:outline-none border border-white/5 cursor-pointer"
                title="Zoom In (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              {/* Reset Zoom */}
              <button
                onClick={handleResetZoom}
                disabled={zoomScale === 1 && panPosition.x === 0 && panPosition.y === 0}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-40 disabled:hover:bg-white/5 transition-all focus:outline-none border border-white/5 cursor-pointer"
                title="Reset Zoom"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <div className="w-px h-6 bg-white/10 mx-1" />

              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="p-2 rounded-lg bg-red-950/20 hover:bg-red-900/40 text-red-400 hover:text-red-300 transition-all focus:outline-none border border-red-900/20 cursor-pointer"
                title="Close (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Content Area (Image and Navigation) */}
          <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden px-4">
            
            {/* Left Nav Button */}
            {galleryImages.length > 1 && (
              <button
                onClick={handleLightboxPrev}
                className="absolute left-6 z-10 w-11 h-11 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/60 text-white hover:text-gold border border-white/10 hover:scale-105 transition-all focus:outline-none cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
              </button>
            )}

            {/* Interactive Image Viewport */}
            <div 
              className={`w-full h-full max-w-5xl max-h-[75vh] flex items-center justify-center ${
                zoomScale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
              }`}
            >
              <img
                src={galleryImages[lightboxIndex]}
                alt={`${property.title} - Zoom View`}
                style={{
                  transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomScale})`,
                  transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                  maxHeight: '75vh',
                  maxWidth: '90%',
                  objectFit: 'contain',
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                draggable={false}
                className="rounded-lg shadow-2xl select-none"
              />
            </div>

            {/* Right Nav Button */}
            {galleryImages.length > 1 && (
              <button
                onClick={handleLightboxNext}
                className="absolute right-6 z-10 w-11 h-11 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/60 text-white hover:text-gold border border-white/10 hover:scale-105 transition-all focus:outline-none cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 stroke-[2.5]" />
              </button>
            )}
          </div>

          {/* Footer Navigation Strip */}
          <div className="w-full py-4 bg-black/40 border-t border-white/5 flex items-center justify-center gap-2 overflow-x-auto px-6">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setLightboxIndex(idx);
                  handleResetZoom();
                }}
                className={`flex-shrink-0 w-16 h-10 rounded-md overflow-hidden border-2 transition-all cursor-pointer ${
                  lightboxIndex === idx ? 'border-gold scale-105' : 'border-white/10 hover:border-white/40'
                }`}
                style={{ borderColor: lightboxIndex === idx ? GOLD : 'rgba(255,255,255,0.1)' }}
              >
                <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPropertyView;

