import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Save, FileImage, ClipboardList, Info, MapPin, Settings } from 'lucide-react';
import type { Property } from '@/utils/constants';
import axios from 'axios';

const GOLD = '#C9A84C';
const NAVY = '#0B1120';

const AVAILABLE_AMENITIES = [
  '24x7 Security',
  'Power Backup',
  'Lift',
  'CCTV Camera',
  'Gym',
  'Children Play Area',
  'Multipurpose Hall',
  'Private Pool',
  'Landscaped Gardens',
  'Private Terrace',
  'Modular Kitchen',
  'Sea View',
];

export const AdminPropertyForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { properties, addProperty, updateProperty } = useApp();

  const isEditMode = !!id;

  // Retrieve original property if in edit mode
  const originalProperty = useMemo(() => {
    if (!isEditMode || !id) return null;
    return properties.find((p) => p.id.toString() === id.toString());
  }, [properties, id, isEditMode]);

  // Form fields state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<Property['type']>('Apartment');
  const [badge, setBadge] = useState<Property['badge']>('FOR SALE');
  const [price, setPrice] = useState('');
  const [priceVal, setPriceVal] = useState<number>(0);
  const [beds, setBeds] = useState<number>(0);
  const [baths, setBaths] = useState<number>(0);
  const [balconies, setBalconies] = useState<number>(0);
  const [parking, setParking] = useState<number>(0);
  const [area, setArea] = useState('');
  const [areaVal, setAreaVal] = useState<number>(0);
  const [furnishing, setFurnishing] = useState<Property['furnishing']>('Furnished');
  const [status, setStatus] = useState<Property['status']>('Ready to Move');
  const [featured, setFeatured] = useState(false);
  const [showOnWebsite, setShowOnWebsite] = useState(true);
  const [coverImage, setCoverImage] = useState('');
  const [galleryText, setGalleryText] = useState('');

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setIsUploadingCover(true);
    try {
      const res = await axios.post('/api/upload/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setCoverImage(res.data.url);
      }
    } catch (error) {
      console.error('Cover upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    setIsUploadingGallery(true);
    try {
      const res = await axios.post('/api/upload/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        const newUrls = res.data.urls.join(', ');
        setGalleryText((prev) => (prev ? `${prev}, ${newUrls}` : newUrls));
      }
    } catch (error) {
      console.error('Gallery upload failed:', error);
      alert('Failed to upload gallery images. Please try again.');
    } finally {
      setIsUploadingGallery(false);
    }
  };

  // Populating states in edit mode
  useEffect(() => {
    if (isEditMode && originalProperty) {
      setTitle(originalProperty.title);
      setDescription(originalProperty.description);
      setLocation(originalProperty.location);
      setType(originalProperty.type);
      setBadge(originalProperty.badge);
      
      let cleanPrice = originalProperty.price;
      if (cleanPrice.startsWith('₹')) {
        cleanPrice = cleanPrice.replace(/^₹\s*/, '');
      }
      setPrice(cleanPrice);

      setPriceVal(originalProperty.priceVal);
      setBeds(originalProperty.beds ?? 0);
      setBaths(originalProperty.baths ?? 0);
      setBalconies(originalProperty.balconies ?? 0);
      setParking(originalProperty.parking ?? 0);
      setArea(originalProperty.area);
      setAreaVal(originalProperty.areaVal);
      setFurnishing(originalProperty.furnishing);
      setStatus(originalProperty.status);
      setFeatured(originalProperty.featured);
      setShowOnWebsite(originalProperty.showOnWebsite);
      setCoverImage(originalProperty.image);
      setSelectedAmenities(originalProperty.amenities || []);

      // gallery
      if (originalProperty.gallery) {
        setGalleryText(originalProperty.gallery.join(', '));
      }
    }
  }, [isEditMode, originalProperty]);

  // Handle price helper to auto-populate priceVal
  const handlePriceChange = (val: string) => {
    setPrice(val);
    // Extract numbers to guess value
    const numericStr = val.replace(/[^0-9]/g, '');
    const num = parseInt(numericStr, 10);
    if (!isNaN(num)) {
      // If it says "Month", and is under 500,000, keep it as is.
      // If it's in Lakhs (e.g. ₹ 95,00,000) or Crores (₹ 5.75 Crore), compute properly
      setPriceVal(num);
    }
  };

  // Handle area helper to auto-populate areaVal
  const handleAreaChange = (val: string) => {
    setArea(val);
    const numericStr = val.replace(/[^0-9]/g, '');
    const num = parseInt(numericStr, 10);
    if (!isNaN(num)) {
      setAreaVal(num);
    }
  };

  // Toggle individual amenity
  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !location.trim() || !price.trim() || !area.trim() || !coverImage.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    // Parse gallery
    const gallery = galleryText
      .split(',')
      .map((img) => img.trim())
      .filter((img) => img.length > 0);

    const propertyData: Omit<Property, 'id'> = {
      title,
      description,
      location,
      price: price.trim().startsWith('₹') ? price.trim() : `₹ ${price.trim()}`,
      priceVal: priceVal || 0,
      badge,
      badgeColor: badge === 'FOR RENT' ? 'blue' : 'gold',
      image: coverImage,
      beds: beds || undefined,
      baths: baths || undefined,
      balconies: balconies || undefined,
      parking: parking || undefined,
      area,
      areaVal: areaVal || 0,
      type,
      furnishing,
      status,
      featured,
      showOnWebsite,
      amenities: selectedAmenities,
      gallery,
    };

    if (isEditMode && originalProperty) {
      updateProperty({
        ...propertyData,
        id: originalProperty.id,
      });
    } else {
      addProperty(propertyData);
    }

  };

  if (isEditMode && !originalProperty) {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center space-y-4 shadow-sm">
        <h3 className="text-xl font-bold text-[#0B1120]" style={{ fontFamily: '"Playfair Display", serif' }}>Property Not Found</h3>
        <p className="text-xs text-slate-500">The property you are trying to edit does not exist.</p>
        <Link to="/admin/properties" className="text-gold flex items-center justify-center gap-1 font-semibold no-underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Properties
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 font-inter text-xs text-slate-600">
      
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5 gap-4">
        <div className="space-y-1">
          <Link
            to="/admin/properties"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#0B1120] no-underline font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Inventory
          </Link>
          <h1 style={{ fontFamily: '"Playfair Display", serif', color: '#0B1120' }} className="text-2xl font-bold tracking-wide">
            {isEditMode ? 'Edit Property Listing' : 'Create New Listing'}
          </h1>
        </div>
        
        <button
          type="submit"
          className="py-2.5 px-6 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm text-[#0B1120] hover:opacity-95 transition-opacity cursor-pointer flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${GOLD}, #E6C97A)` }}
        >
          <Save className="w-4 h-4" />
          {isEditMode ? 'Save Changes' : 'Create Listing'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns: Basic & Detailed Form Info (Grid Column 1 & 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Property Information */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 font-semibold">
              <ClipboardList className="w-4 h-4 text-gold" style={{ color: GOLD }} />
              <h3 className="text-sm font-bold text-[#0B1120]" style={{ fontFamily: '"Playfair Display", serif' }}>Property Information</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-1.5">
                  Property Reference Number
                </label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={originalProperty ? (originalProperty as any).propertyNumber || '' : 'NSR-XXX (Auto-Generated)'}
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg py-2.5 px-3 text-slate-500 font-bold select-none cursor-not-allowed uppercase tracking-wider"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-1.5">
                  Property Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Premium 4 BHK Sea-Facing Penthouse"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-1.5">
                  Description
                </label>
                <textarea
                  rows={6}
                  placeholder="Describe details like layout, features, neighborhood..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-all resize-none font-medium leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-1.5">
                  Property Type *
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as Property['type'])}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-slate-850 focus:outline-none focus:border-slate-400 focus:bg-white transition-all font-semibold"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Independent House">Independent House</option>
                  <option value="Plot">Plot / Land</option>
                  <option value="Commercial">Commercial Space</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 2: Pricing & Status */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 font-semibold">
              <Info className="w-4 h-4 text-gold" style={{ color: GOLD }} />
              <h3 className="text-sm font-bold text-[#0B1120]" style={{ fontFamily: '"Playfair Display", serif' }}>Pricing & Status</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Deal Type */}
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-1.5">
                  Deal Type *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['FOR SALE', 'FOR RENT'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBadge(b as Property['badge'])}
                      className={`py-2.5 text-xs font-bold rounded-lg transition-all border cursor-pointer ${
                        badge === b
                          ? 'bg-[#0B1120] text-[#C9A84C] border-[#0B1120]'
                          : 'bg-slate-50 text-slate-405 border-slate-200 hover:bg-slate-100 hover:text-slate-600'
                      }`}
                    >
                      {b === 'FOR SALE' ? 'For Sale' : 'For Rent'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Display */}
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-1.5">
                  Price Label * (Text Display)
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold select-none text-sm pointer-events-none">
                    ₹
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 4,50,00,000 or 85,000 / Month"
                    value={price}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-8 pr-3 text-slate-805 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              {/* Price Numeric */}
              <div>
                <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest mb-1.5">
                  Numeric Price Value * (For sorting/filters)
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold select-none text-sm pointer-events-none">
                    ₹
                  </div>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 45000000 or 85000"
                    value={priceVal || ''}
                    onChange={(e) => setPriceVal(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-8 pr-3 text-slate-805 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-1.5">
                  Construction Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Property['status'])}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-slate-850 focus:outline-none focus:border-slate-400 focus:bg-white transition-all font-semibold"
                >
                  <option value="Ready to Move">Ready to Move</option>
                  <option value="Under Construction">Under Construction</option>
                  <option value="New Launch">New Launch</option>
                </select>
              </div>

            </div>
          </div>

          {/* Card 3: Location */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 font-semibold">
              <MapPin className="w-4 h-4 text-gold" style={{ color: GOLD }} />
              <h3 className="text-sm font-bold text-[#0B1120]" style={{ fontFamily: '"Playfair Display", serif' }}>Location</h3>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-1.5">
                Location / Address *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Bandra West, Mumbai"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-slate-805 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          {/* Card 4: Specifications */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 font-semibold">
              <ClipboardList className="w-4 h-4 text-gold" style={{ color: GOLD }} />
              <h3 className="text-sm font-bold text-[#0B1120]" style={{ fontFamily: '"Playfair Display", serif' }}>Specifications</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Area Display */}
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-1.5">
                  Built Area Label * (Text Display)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1850 Sq. Ft."
                  value={area}
                  onChange={(e) => handleAreaChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-slate-805 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-all font-medium"
                />
              </div>

              {/* Area Numeric */}
              <div>
                <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest mb-1.5">
                  Numeric Area Value * (For filters)
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 1850"
                  value={areaVal || ''}
                  onChange={(e) => setAreaVal(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-slate-805 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-all font-medium"
                />
              </div>

              {/* Furnishing */}
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-1.5">
                  Furnishing Status
                </label>
                <select
                  value={furnishing}
                  onChange={(e) => setFurnishing(e.target.value as Property['furnishing'])}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-slate-850 focus:outline-none focus:border-slate-400 focus:bg-white transition-all font-semibold"
                >
                  <option value="Furnished">Furnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div>

              {/* Parking */}
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-1.5">
                  Parking Spaces
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="e.g. 1"
                  value={parking}
                  onChange={(e) => setParking(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-slate-805 focus:outline-none focus:border-slate-400 focus:bg-white transition-all font-medium"
                />
              </div>

              {/* Beds */}
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-1.5">
                  Bedrooms count (Optional)
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="e.g. 3"
                  value={beds}
                  onChange={(e) => setBeds(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-slate-855 focus:outline-none focus:border-slate-400 focus:bg-white transition-all font-medium"
                />
              </div>

              {/* Baths */}
              <div>
                <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest mb-1.5">
                  Bathrooms count (Optional)
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="e.g. 3"
                  value={baths}
                  onChange={(e) => setBaths(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-slate-855 focus:outline-none focus:border-slate-400 focus:bg-white transition-all font-medium"
                />
              </div>

              {/* Balconies */}
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-1.5">
                  Balconies count (Optional)
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="e.g. 2"
                  value={balconies}
                  onChange={(e) => setBalconies(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-slate-855 focus:outline-none focus:border-slate-400 focus:bg-white transition-all font-medium"
                />
              </div>

            </div>
          </div>

          {/* Card 5: Amenities */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 font-semibold">
              <ClipboardList className="w-4 h-4 text-gold" style={{ color: GOLD }} />
              <h3 className="text-sm font-bold text-[#0B1120]" style={{ fontFamily: '"Playfair Display", serif' }}>Amenities</h3>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {AVAILABLE_AMENITIES.map((amenity) => {
                const isChecked = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => handleAmenityToggle(amenity)}
                    className={`py-2 px-3 text-left rounded-lg transition-all border flex items-center justify-between cursor-pointer ${
                      isChecked
                        ? 'bg-gold/10 text-gold border-gold/30'
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-semibold text-[11px]">{amenity}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${isChecked ? 'bg-gold' : 'bg-slate-300'}`} />
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Images, Flags, Submission Sidebar (Grid Column 3) */}
        <div className="space-y-6">
          
          {/* Card 6: Gallery Images */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 font-semibold">
              <FileImage className="w-4 h-4 text-gold" style={{ color: GOLD }} />
              <h3 className="text-sm font-bold text-[#0B1120]" style={{ fontFamily: '"Playfair Display", serif' }}>Gallery Images</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-1.5">
                  Main Cover Image URL *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://images.unsplash.com/photo-..."
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-slate-805 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-all font-medium"
                />
                <div className="mt-2.5 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Or upload file:</span>
                  <label className="cursor-pointer bg-slate-50 hover:bg-slate-100 text-gold hover:text-[#0B1120] border border-slate-200 py-1.5 px-3 rounded-lg font-bold text-[10px] tracking-wide transition-colors">
                    {isUploadingCover ? 'Uploading...' : 'Choose File'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      disabled={isUploadingCover}
                      className="hidden"
                    />
                  </label>
                </div>
                {coverImage.trim() && (
                  <div className="mt-3 h-40 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 shadow-inner relative group">
                    <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold tracking-widest uppercase">
                      Current Cover
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 pt-4">
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-1.5">
                  Gallery Image URLs (Comma Separated)
                </label>
                <textarea
                  rows={4}
                  placeholder="https://image1.jpg, https://image2.jpg, ..."
                  value={galleryText}
                  onChange={(e) => setGalleryText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-805 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-all resize-none text-[11px] leading-relaxed font-medium"
                />
                <div className="mt-2.5 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Or upload files:</span>
                  <label className="cursor-pointer bg-slate-50 hover:bg-slate-100 text-gold hover:text-[#0B1120] border border-slate-200 py-1.5 px-3 rounded-lg font-bold text-[10px] tracking-wide transition-colors">
                    {isUploadingGallery ? 'Uploading...' : 'Choose Files'}
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleGalleryUpload}
                      disabled={isUploadingGallery}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 font-inter leading-relaxed">
                  Enter multiple image links separated by a comma (`,`) to form the property gallery slider.
                </p>
              </div>
            </div>
          </div>

          {/* Card 7: Visibility Settings */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 font-semibold">
              <Settings className="w-4 h-4 text-gold" style={{ color: GOLD }} />
              <h3 className="text-sm font-bold text-[#0B1120]" style={{ fontFamily: '"Playfair Display", serif' }}>Visibility Settings</h3>
            </div>

            <div className="space-y-4">
              {/* Show on Website toggle */}
              <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-[#0B1120] font-inter">Show On Website</div>
                  <div className="text-[10px] text-slate-400 font-inter">Controls public page visibility</div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowOnWebsite(!showOnWebsite)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none flex items-center cursor-pointer ${
                    showOnWebsite ? 'bg-[#0B1120]' : 'bg-gray-200'
                  }`}
                  title={showOnWebsite ? 'Hide from Website' : 'Show on Website'}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out ${
                      showOnWebsite ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Featured toggle */}
              <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-[#0B1120] font-inter">Featured Property</div>
                  <div className="text-[10px] text-slate-400 font-inter">Promote on homepage featured list</div>
                </div>
                <button
                  type="button"
                  onClick={() => setFeatured(!featured)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none flex items-center cursor-pointer ${
                    featured ? 'bg-[#0B1120]' : 'bg-gray-200'
                  }`}
                  title={featured ? 'Unmark Featured' : 'Mark Featured'}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out ${
                      featured ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

            </div>
          </div>

          {/* Cancel button */}
          <Link
            to="/admin/properties"
            className="block text-center py-2.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg font-semibold transition-all text-slate-500 hover:text-[#0B1120] no-underline font-inter"
          >
            Cancel & Return
          </Link>

        </div>

      </div>

    </form>
  );
};

export default AdminPropertyForm;
