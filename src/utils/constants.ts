// ─── Navigation ─────────────────────────────────────────────
export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Properties', href: '/properties' },
  { label: 'Contact Us', href: '/contact' },
] as const;

export const PHONE_NUMBER = '+91 76203 33467';
export const PHONE_HREF = 'tel:+917620333467';
export const EMAIL = 'info@newstarrealestate.com';

// ─── Company ─────────────────────────────────────────────────
export const COMPANY_NAME = 'NEW STAR REAL ESTATE';
export const COMPANY_TAGLINE = 'Helping You Find Your Perfect Home & Investment.';
export const COMPANY_ADDRESS = 'New Star Real Estate, Hiranandani Fortune City, Panvel, Navi Mumbai';

// ─── Hero ─────────────────────────────────────────────────────
export const HERO_WELCOME = 'Premium Property Consultant';
export const HERO_TITLE = 'Resale Flats, Villas & Farmhouses';
export const HERO_SUBTITLE = 'Browse verified property listings in Panvel, Navi Mumbai, Lonavala and Karjat. Schedule a site visit today.';

// ─── Search ──────────────────────────────────────────────────
export const LOCATION_OPTIONS = [
  'All Locations',
  'Andheri West, Mumbai',
  'Bandra West, Mumbai',
  'Lower Parel, Mumbai',
  'Powai, Mumbai',
  'Thane, Mumbai',
  'Navi Mumbai',
  'Pune',
  'Delhi NCR',
  'Bengaluru',
];

export const PROPERTY_TYPE_OPTIONS = [
  'All Types',
  'Apartment',
  'Villa',
  'Commercial Office',
  'Penthouse',
  'Studio',
  'Plot / Land',
  'Row House',
];

export const BUDGET_OPTIONS = [
  'Any Budget',
  'Under ₹50 Lakh',
  '₹50L – ₹1 Crore',
  '₹1Cr – ₹2 Crore',
  '₹2Cr – ₹5 Crore',
  '₹5Cr – ₹10 Crore',
  'Above ₹10 Crore',
];

// ─── Properties ──────────────────────────────────────────────
export interface Property {
  id: number | string;
  propertyNumber?: string;
  slug?: string;
  title: string;
  location: string;
  price: string;
  priceVal: number;
  badge: 'FOR SALE' | 'FOR RENT';
  badgeColor: 'gold' | 'blue';
  image: string;
  beds?: number;
  baths?: number;
  balconies?: number;
  parking?: number;
  area: string;
  areaVal: number;
  type: 'Apartment' | 'Villa' | 'Independent House' | 'Plot' | 'Commercial' | 'Penthouse' | 'Studio' | 'Row House';
  furnishing: 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
  status: 'Ready to Move' | 'Under Construction' | 'New Launch';
  featured: boolean;
  showOnWebsite: boolean;
  description: string;
  amenities: string[];
  gallery: string[];
}

export interface MockEnquiry {
  id: number | string;
  propertyId?: string;
  name: string;
  phone: string;
  email: string;
  propertyTitle: string;
  date: string;
  message: string;
  status: 'New' | 'Contacted' | 'Closed';
}

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 1,
    title: 'Premium Villa',
    location: 'Juhu, Mumbai',
    price: '₹ 5,75,00,000',
    priceVal: 57500000,
    badge: 'FOR SALE',
    badgeColor: 'gold',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    beds: 4,
    baths: 4,
    balconies: 3,
    parking: 2,
    area: '3200 Sq. Ft.',
    areaVal: 3200,
    type: 'Villa',
    furnishing: 'Furnished',
    status: 'Ready to Move',
    featured: true,
    showOnWebsite: true,
    description: 'An architectural masterpiece offering unparalleled luxury. This premium 4 BHK villa in the elite neighborhood of Juhu features double-height ceilings, a private swimming pool, landscaped gardens, and high-end marble finishings throughout.',
    amenities: ['24x7 Security', 'Power Backup', 'Lift', 'CCTV Camera', 'Gym', 'Children Play Area', 'Multipurpose Hall'],
    gallery: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80'
    ]
  },
  {
    id: 2,
    title: 'Spacious 2 BHK Apartment',
    location: 'Andheri West, Mumbai',
    price: '₹ 1,25,00,000',
    priceVal: 12500000,
    badge: 'FOR SALE',
    badgeColor: 'gold',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    beds: 2,
    baths: 2,
    balconies: 2,
    parking: 1,
    area: '950 Sq. Ft.',
    areaVal: 950,
    type: 'Apartment',
    furnishing: 'Semi-Furnished',
    status: 'Ready to Move',
    featured: true,
    showOnWebsite: true,
    description: 'A spacious and beautifully designed 2 BHK apartment in a prestigious gated community in Andheri West. High floor offering open city views, premium modular kitchen, master bedroom with wooden flooring, and round-the-clock security.',
    amenities: ['24x7 Security', 'Power Backup', 'Lift', 'CCTV Camera', 'Gym', 'Children Play Area'],
    gallery: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80'
    ]
  },
  {
    id: 3,
    title: 'Luxury 3 BHK Apartment',
    location: 'Bandra West, Mumbai',
    price: '₹ 85,000 / Month',
    priceVal: 85000,
    badge: 'FOR RENT',
    badgeColor: 'blue',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    beds: 3,
    baths: 3,
    balconies: 2,
    parking: 1,
    area: '1450 Sq. Ft.',
    areaVal: 1450,
    type: 'Apartment',
    furnishing: 'Furnished',
    status: 'Ready to Move',
    featured: true,
    showOnWebsite: true,
    description: 'Discover a thoughtfully designed 3 BHK apartment that blends style, comfort, and functionality. With spacious rooms, modern interiors, and plenty of natural light, this home offers the perfect setting for a comfortable lifestyle. Located in a prime area in Bandra West with excellent connectivity and top-class amenities.',
    amenities: ['24x7 Security', 'Power Backup', 'Lift', 'CCTV Camera', 'Gym', 'Children Play Area', 'Multipurpose Hall'],
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80'
    ]
  },
  {
    id: 4,
    title: 'Commercial Office Space',
    location: 'Lower Parel, Mumbai',
    price: '₹ 3,20,00,000',
    priceVal: 32000000,
    badge: 'FOR SALE',
    badgeColor: 'gold',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    beds: 0,
    baths: 2,
    balconies: 0,
    parking: 2,
    area: '2500 Sq. Ft.',
    areaVal: 2500,
    type: 'Commercial',
    furnishing: 'Unfurnished',
    status: 'Ready to Move',
    featured: true,
    showOnWebsite: true,
    description: 'A premium grade-A commercial office space in a high-rise business park in Lower Parel. Corner office offering plenty of natural light, glass partitions, server room, executive cabins, pantry, and dedicated car parking spaces.',
    amenities: ['24x7 Security', 'Power Backup', 'Lift', 'CCTV Camera'],
    gallery: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80'
    ]
  },
  {
    id: 5,
    title: 'Modern 2 BHK Apartment',
    location: 'Goregaon East, Mumbai',
    price: '₹ 95,00,000',
    priceVal: 9500000,
    badge: 'FOR SALE',
    badgeColor: 'gold',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    beds: 2,
    baths: 2,
    balconies: 1,
    parking: 1,
    area: '800 Sq. Ft.',
    areaVal: 800,
    type: 'Apartment',
    furnishing: 'Semi-Furnished',
    status: 'Ready to Move',
    featured: false,
    showOnWebsite: false,
    description: 'Compact yet beautifully planned 2 BHK flat in Goregaon East. Features modular fixtures, modern floor tiling, open kitchen plan, and close proximity to Western Express Highway and Metro Station.',
    amenities: ['24x7 Security', 'Power Backup', 'Lift', 'CCTV Camera', 'Children Play Area'],
    gallery: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      'https://images.unsplash.com/photo-1600566752229-25e407fe8144?w=800&q=80'
    ]
  },
  {
    id: 6,
    title: 'Fully Furnished 3 BHK',
    location: 'Worli, Mumbai',
    price: '₹ 1,10,000 / Month',
    priceVal: 110000,
    badge: 'FOR RENT',
    badgeColor: 'blue',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
    beds: 3,
    baths: 3,
    balconies: 2,
    parking: 1,
    area: '1500 Sq. Ft.',
    areaVal: 1500,
    type: 'Apartment',
    furnishing: 'Furnished',
    status: 'Ready to Move',
    featured: false,
    showOnWebsite: true,
    description: 'High-end fully furnished 3 BHK apartment in Worli. Offering breathtaking sea views, designer Italian furniture, complete kitchen appliances, multi-split ACs, and high-speed elevator access.',
    amenities: ['24x7 Security', 'Power Backup', 'Lift', 'CCTV Camera', 'Gym', 'Children Play Area', 'Multipurpose Hall'],
    gallery: [
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80'
    ]
  },
  {
    id: 7,
    title: 'Independent House',
    location: 'Chembur, Mumbai',
    price: '₹ 2,45,00,000',
    priceVal: 24500000,
    badge: 'FOR SALE',
    badgeColor: 'gold',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
    beds: 3,
    baths: 3,
    balconies: 2,
    parking: 1,
    area: '1800 Sq. Ft.',
    areaVal: 1800,
    type: 'Independent House',
    furnishing: 'Semi-Furnished',
    status: 'Ready to Move',
    featured: false,
    showOnWebsite: true,
    description: 'A beautiful independent duplex house located in a peaceful residential pocket of Chembur. Duplex structure featuring a private porch, balconies in all rooms, private terrace, and borewell facility.',
    amenities: ['24x7 Security', 'Power Backup', 'CCTV Camera'],
    gallery: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'
    ]
  },
  {
    id: 8,
    title: 'Residential Plot',
    location: 'Panvel, Navi Mumbai',
    price: '₹ 45,00,000',
    priceVal: 4500000,
    badge: 'FOR SALE',
    badgeColor: 'gold',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
    beds: 0,
    baths: 0,
    balconies: 0,
    parking: 0,
    area: '2400 Sq. Ft.',
    areaVal: 2400,
    type: 'Plot',
    furnishing: 'Unfurnished',
    status: 'New Launch',
    featured: false,
    showOnWebsite: true,
    description: 'A level residential plot measuring 2400 sq. ft. in a gated layout project near Panvel. Immediate registration, internal tar road access, electricity connections, water pipeline, and clear title files.',
    amenities: ['24x7 Security', 'CCTV Camera'],
    gallery: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80'
    ]
  },
  {
    id: 9,
    title: 'Luxury Villa with Pool',
    location: 'Alibaug, Mumbai',
    price: '₹ 8,50,00,000',
    priceVal: 85000000,
    badge: 'FOR SALE',
    badgeColor: 'gold',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    beds: 5,
    baths: 6,
    balconies: 4,
    parking: 3,
    area: '4500 Sq. Ft.',
    areaVal: 4500,
    type: 'Villa',
    furnishing: 'Furnished',
    status: 'Ready to Move',
    featured: false,
    showOnWebsite: true,
    description: 'An elite weekend home getaway villa in Alibaug. Spans 4500 sq. ft. of pure luxury, featuring a private swimming pool with infinity edge, open terrace bars, home automation system, and premium furnishings.',
    amenities: ['24x7 Security', 'Power Backup', 'CCTV Camera', 'Gym', 'Children Play Area', 'Multipurpose Hall'],
    gallery: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80'
    ]
  },
  {
    id: 10,
    title: 'Penthouse Apartment',
    location: 'Worli, Mumbai',
    price: '₹ 12,00,00,000',
    priceVal: 120000000,
    badge: 'FOR SALE',
    badgeColor: 'gold',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80',
    beds: 4,
    baths: 5,
    balconies: 3,
    parking: 2,
    area: '5000 Sq. Ft.',
    areaVal: 5000,
    type: 'Penthouse',
    furnishing: 'Furnished',
    status: 'Ready to Move',
    featured: false,
    showOnWebsite: false,
    description: 'Duplex Penthouse in Worli. Top floors offering panoramic 360-degree views of the Arabian Sea, private jacuzzi, glass walls, state-of-the-art security, and absolute privacy.',
    amenities: ['24x7 Security', 'Power Backup', 'Lift', 'CCTV Camera', 'Gym', 'Multipurpose Hall'],
    gallery: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80'
    ]
  },
  {
    id: 11,
    title: 'Cozy Studio Apartment',
    location: 'Andheri East, Mumbai',
    price: '₹ 65,00,000',
    priceVal: 6500000,
    badge: 'FOR SALE',
    badgeColor: 'gold',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    beds: 1,
    baths: 1,
    balconies: 1,
    parking: 0,
    area: '450 Sq. Ft.',
    areaVal: 450,
    type: 'Studio',
    furnishing: 'Furnished',
    status: 'Ready to Move',
    featured: false,
    showOnWebsite: true,
    description: 'Perfect for bachelors and young couples, this cozy studio apartment offers smart space utilization, modern fittings, and close proximity to major transport hubs.',
    amenities: ['24x7 Security', 'Lift', 'CCTV Camera'],
    gallery: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'
    ]
  },
  {
    id: 12,
    title: 'Elegant Sea-Facing Flat',
    location: 'Juhu, Mumbai',
    price: '₹ 1,50,000 / Month',
    priceVal: 150000,
    badge: 'FOR RENT',
    badgeColor: 'blue',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1de2d9d0cb?w=800&q=80',
    beds: 3,
    baths: 3,
    balconies: 2,
    parking: 2,
    area: '1800 Sq. Ft.',
    areaVal: 1800,
    type: 'Apartment',
    furnishing: 'Semi-Furnished',
    status: 'Ready to Move',
    featured: true,
    showOnWebsite: true,
    description: 'Wake up to the sound of waves. This elegant 3 BHK offers uninterrupted sea views, large balconies, premium Italian marble flooring, and access to a rooftop pool.',
    amenities: ['24x7 Security', 'Power Backup', 'Lift', 'CCTV Camera', 'Gym', 'Swimming Pool'],
    gallery: [
      'https://images.unsplash.com/photo-1502672260266-1c1de2d9d0cb?w=800&q=80'
    ]
  },
  {
    id: 13,
    title: 'Spacious Family Home',
    location: 'Powai, Mumbai',
    price: '₹ 2,10,00,000',
    priceVal: 21000000,
    badge: 'FOR SALE',
    badgeColor: 'gold',
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80',
    beds: 4,
    baths: 3,
    balconies: 2,
    parking: 1,
    area: '2100 Sq. Ft.',
    areaVal: 2100,
    type: 'Independent House',
    furnishing: 'Unfurnished',
    status: 'Ready to Move',
    featured: false,
    showOnWebsite: true,
    description: 'Located in the lush green environment of Powai, this spacious family home offers a private garden, spacious living areas, and excellent connectivity to top schools and hospitals.',
    amenities: ['24x7 Security', 'Power Backup', 'Children Play Area', 'Garden'],
    gallery: [
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80'
    ]
  },
  {
    id: 14,
    title: 'Corporate Office Suite',
    location: 'BKC, Mumbai',
    price: '₹ 5,00,00,000',
    priceVal: 50000000,
    badge: 'FOR SALE',
    badgeColor: 'gold',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80',
    beds: 0,
    baths: 2,
    balconies: 1,
    parking: 4,
    area: '4000 Sq. Ft.',
    areaVal: 4000,
    type: 'Commercial',
    furnishing: 'Furnished',
    status: 'Ready to Move',
    featured: true,
    showOnWebsite: true,
    description: 'A prestigious address for your business. This fully furnished corporate suite in BKC comes with 4 executive cabins, a 20-seater conference room, workstations, and a modern cafeteria.',
    amenities: ['24x7 Security', 'Power Backup', 'Lift', 'CCTV Camera', 'Cafeteria'],
    gallery: [
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80'
    ]
  },
  {
    id: 15,
    title: 'Modern Row House',
    location: 'Thane, Mumbai',
    price: '₹ 1,85,00,000',
    priceVal: 18500000,
    badge: 'FOR SALE',
    badgeColor: 'gold',
    image: 'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=800&q=80',
    beds: 3,
    baths: 3,
    balconies: 2,
    parking: 2,
    area: '1600 Sq. Ft.',
    areaVal: 1600,
    type: 'Row House',
    furnishing: 'Semi-Furnished',
    status: 'Ready to Move',
    featured: true,
    showOnWebsite: true,
    description: 'Beautiful 3 BHK row house in Thane featuring an open layout, private front garden, and dedicated parking. Perfect for a growing family seeking space and privacy in a gated community.',
    amenities: ['24x7 Security', 'Children Play Area', 'Garden', 'CCTV Camera'],
    gallery: ['https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=800&q=80']
  },
  {
    id: 16,
    title: 'Luxury IT Park Office',
    location: 'Pune',
    price: '₹ 4,50,00,000',
    priceVal: 45000000,
    badge: 'FOR SALE',
    badgeColor: 'gold',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
    beds: 0,
    baths: 4,
    balconies: 1,
    parking: 5,
    area: '5000 Sq. Ft.',
    areaVal: 5000,
    type: 'Commercial',
    furnishing: 'Unfurnished',
    status: 'Ready to Move',
    featured: true,
    showOnWebsite: true,
    description: 'Premium IT Park commercial space in Hinjewadi, Pune. Excellent for IT/ITES companies featuring grade-A infrastructure, huge floor plate, central AC, and high-speed elevators.',
    amenities: ['24x7 Security', 'Power Backup', 'Lift', 'Cafeteria', 'CCTV Camera'],
    gallery: ['https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80']
  },
  {
    id: 17,
    title: 'Spacious Independent Villa',
    location: 'Delhi NCR',
    price: '₹ 6,20,00,000',
    priceVal: 62000000,
    badge: 'FOR SALE',
    badgeColor: 'gold',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    beds: 5,
    baths: 5,
    balconies: 4,
    parking: 3,
    area: '4200 Sq. Ft.',
    areaVal: 4200,
    type: 'Villa',
    furnishing: 'Furnished',
    status: 'Ready to Move',
    featured: true,
    showOnWebsite: true,
    description: 'Luxurious 5 BHK villa in the heart of Delhi NCR. Features a double-height living room, imported marble, automated lighting, and an expansive terrace with a gazebo.',
    amenities: ['24x7 Security', 'Power Backup', 'Gym', 'Garden'],
    gallery: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80']
  },
  {
    id: 18,
    title: 'Premium High-Rise Apartment',
    location: 'Bengaluru',
    price: '₹ 2,75,00,000',
    priceVal: 27500000,
    badge: 'FOR SALE',
    badgeColor: 'gold',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    beds: 3,
    baths: 3,
    balconies: 2,
    parking: 2,
    area: '2000 Sq. Ft.',
    areaVal: 2000,
    type: 'Apartment',
    furnishing: 'Semi-Furnished',
    status: 'Ready to Move',
    featured: true,
    showOnWebsite: true,
    description: 'A spectacular high-rise 3 BHK apartment in Whitefield, Bengaluru. Enjoy premium club amenities, a temperature-controlled swimming pool, and breathtaking city skyline views.',
    amenities: ['24x7 Security', 'Power Backup', 'Lift', 'Swimming Pool', 'Gym'],
    gallery: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80']
  }
];

export interface MockEnquiry {
  id: number | string;
  propertyId?: string;
  name: string;
  phone: string;
  email: string;
  propertyTitle: string;
  date: string;
  message: string;
  status: 'New' | 'Contacted' | 'Closed';
}

export const INITIAL_ENQUIRIES: MockEnquiry[] = [
  {
    id: 1,
    name: 'Amit Patel',
    phone: '+91 98200 12345',
    email: 'amit.patel@gmail.com',
    propertyTitle: 'Luxury 3 BHK Apartment',
    date: '2026-06-15',
    message: 'I am interested in scheduling a visit to this property this Saturday. Please call me back.',
    status: 'New'
  },
  {
    id: 2,
    name: 'Shreya Ghoshal',
    phone: '+91 98199 87654',
    email: 'shreya@outlook.com',
    propertyTitle: 'Premium Villa',
    date: '2026-06-14',
    message: 'Is the price negotiable? What are the furnishing details?',
    status: 'Contacted'
  }
];

export const FEATURED_PROPERTIES: Property[] = INITIAL_PROPERTIES.filter((p) => p.featured);

// ─── Why Choose Us ───────────────────────────────────────────
export interface ServiceFeature {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export const SERVICE_FEATURES: ServiceFeature[] = [
  {
    id: 1,
    icon: 'handshake',
    title: 'Trusted by Clients',
    description: 'We build lasting relationships based on trust and results.',
  },
  {
    id: 2,
    icon: 'building',
    title: 'Wide Range of Properties',
    description: 'Residential, commercial, and investment properties.',
  },
  {
    id: 3,
    icon: 'lightbulb',
    title: 'Expert Guidance',
    description: 'Professional advice to help you make the right move.',
  },
  {
    id: 4,
    icon: 'shield',
    title: 'Smooth & Transparent Process',
    description: 'From site visit to paperwork, we make it hassle-free.',
  },
];

// ─── Stats ───────────────────────────────────────────────────
export interface Stat {
  id: number;
  value: number;
  suffix: string;
  label: string;
  icon: string;
}

export const STATS: Stat[] = [
  { id: 1, value: 10, suffix: '+', label: 'Years of Experience', icon: 'calendar' },
  { id: 2, value: 150, suffix: '+', label: 'Properties Sold', icon: 'home' },
  { id: 3, value: 250, suffix: '+', label: 'Happy Clients', icon: 'users' },
  { id: 4, value: 15, suffix: '+', label: 'Premium Locations', icon: 'map-pin' },
];

// ─── Testimonials ─────────────────────────────────────────────
export interface Testimonial {
  id: number;
  name: string;
  review: string;
  rating: number;
  avatar: string;
  role?: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Rahul Mehta',
    review:
      'New Star Real Estate helped me find my dream home. Their team is professional, honest, and always available to help.',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    role: 'Property Buyer',
  },
  {
    id: 2,
    name: 'Neha Sharma',
    review:
      'Very smooth experience from start to finish. Highly recommended for anyone looking to buy or rent a property.',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    role: 'Apartment Renter',
  },
  {
    id: 3,
    name: 'Vikram Patel',
    review:
      'Great properties and even better service. They truly care about their clients and deliver the best options.',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    role: 'Commercial Investor',
  },
  {
    id: 4,
    name: 'Priya Kapoor',
    review:
      'Found my perfect villa through New Star. The process was transparent and stress-free from day one.',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    role: 'Villa Buyer',
  },
  {
    id: 5,
    name: 'Arjun Singh',
    review:
      'Outstanding service and deep market knowledge. They negotiated a great deal for my commercial space.',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/men/91.jpg',
    role: 'Office Space Buyer',
  },
];

// ─── Footer Quick Links ───────────────────────────────────────
export const QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Properties', href: '/properties' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
];

export const PROPERTY_LINKS = [
  { label: 'Apartments', href: '/properties?type=apartment' },
  { label: 'Villas', href: '/properties?type=villa' },
  { label: 'Commercial', href: '/properties?type=commercial' },
  { label: 'Plots', href: '/properties?type=plot' },
  { label: 'Penthouses', href: '/properties?type=penthouse' },
];

export const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://facebook.com', icon: 'facebook' },
  { label: 'Instagram', href: 'https://instagram.com', icon: 'instagram' },
  { label: 'Twitter', href: 'https://twitter.com', icon: 'twitter' },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: 'linkedin' },
  { label: 'YouTube', href: 'https://youtube.com', icon: 'youtube' },
];
