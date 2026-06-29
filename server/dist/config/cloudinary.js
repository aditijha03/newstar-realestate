"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = exports.isCloudinaryConfigured = void 0;
const cloudinary_1 = require("cloudinary");
const env_1 = require("./env");
const fs_1 = __importDefault(require("fs"));
// Configure Cloudinary only if credentials are set
exports.isCloudinaryConfigured = !!(env_1.CLOUDINARY_CLOUD_NAME &&
    env_1.CLOUDINARY_API_KEY &&
    env_1.CLOUDINARY_API_SECRET);
if (exports.isCloudinaryConfigured) {
    cloudinary_1.v2.config({
        cloud_name: env_1.CLOUDINARY_CLOUD_NAME,
        api_key: env_1.CLOUDINARY_API_KEY,
        api_secret: env_1.CLOUDINARY_API_SECRET,
    });
}
const uploadToCloudinary = async (localFilePath) => {
    if (!exports.isCloudinaryConfigured) {
        throw new Error('Cloudinary is not configured');
    }
    try {
        const result = await cloudinary_1.v2.uploader.upload(localFilePath, {
            folder: 'newstar-realestate',
            resource_type: 'auto',
        });
        // Remove local temp file after upload
        if (fs_1.default.existsSync(localFilePath)) {
            fs_1.default.unlinkSync(localFilePath);
        }
        return result.secure_url;
    }
    catch (error) {
        console.error('Cloudinary upload error:', error);
        // Delete local temp file even if upload failed to avoid clogging space
        if (fs_1.default.existsSync(localFilePath)) {
            fs_1.default.unlinkSync(localFilePath);
        }
        throw error;
    }
};
exports.uploadToCloudinary = uploadToCloudinary;
