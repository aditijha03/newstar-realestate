import { Schema, model, Document, Types } from 'mongoose';

export interface IEnquiry extends Document {
  propertyId?: Types.ObjectId;
  propertyTitle: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  status: 'New' | 'Contacted' | 'Closed';
  createdAt: Date;
}

const enquirySchema = new Schema<IEnquiry>(
  {
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property' },
    propertyTitle: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['New', 'Contacted', 'Closed'], default: 'New' },
    createdAt: { type: Date, default: Date.now }
  }
);

export const Enquiry = model<IEnquiry>('Enquiry', enquirySchema);
