"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLIENT_URL = exports.CLOUDINARY_API_SECRET = exports.CLOUDINARY_API_KEY = exports.CLOUDINARY_CLOUD_NAME = exports.JWT_SECRET = exports.MONGODB_URI = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load env variables
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
exports.PORT = process.env.PORT || '5000';
exports.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/newstar-realestate';
exports.JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkeyfornewstarrealestateadminportal';
exports.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || '';
exports.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '';
exports.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || '';
exports.CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
