import dotenv from 'dotenv';
import path from 'path';

// Load env variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const PORT = process.env.PORT || '5000';
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/newstar-realestate';
export const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkeyfornewstarrealestateadminportal';
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || '';
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '';
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || '';
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
