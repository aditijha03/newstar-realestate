import { Schema, model, Document } from 'mongoose';

export interface IProperty extends Document {
  title: string;
  slug: string;
  description: string;
  type: string;
  purpose?: string;
  badge: 'FOR SALE' | 'FOR RENT';
  badgeColor: 'gold' | 'blue';
  price: string;
  priceVal: number;
  negotiable?: boolean;
  location: string;
  beds?: number;
  baths?: number;
  balconies?: number;
  parking?: number;
  area: string;
  areaVal: number;
  furnishing: 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
  status: 'Ready to Move' | 'Under Construction' | 'New Launch';
  featured: boolean;
  showOnWebsite: boolean;
  image: string;
  thumbnail?: string;
  gallery: string[];
  amenities: string[];
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    purpose: { type: String },
    badge: { type: String, enum: ['FOR SALE', 'FOR RENT'], required: true },
    badgeColor: { type: String, enum: ['gold', 'blue'], required: true },
    price: { type: String, required: true },
    priceVal: { type: Number, required: true },
    negotiable: { type: Boolean, default: false },
    location: { type: String, required: true },
    beds: { type: Number },
    baths: { type: Number },
    balconies: { type: Number },
    parking: { type: Number },
    area: { type: String, required: true },
    areaVal: { type: Number, required: true },
    furnishing: { type: String, enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'], required: true },
    status: { type: String, enum: ['Ready to Move', 'Under Construction', 'New Launch'], required: true },
    featured: { type: Boolean, default: false },
    showOnWebsite: { type: Boolean, default: true },
    image: { type: String, required: true },
    thumbnail: { type: String },
    gallery: [{ type: String }],
    amenities: [{ type: String }],
  },
  {
    timestamps: true
  }
);

export const Property = model<IProperty>('Property', propertySchema);
