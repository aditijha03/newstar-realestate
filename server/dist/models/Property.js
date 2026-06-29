"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Property = void 0;
const mongoose_1 = require("mongoose");
const propertySchema = new mongoose_1.Schema({
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
}, {
    timestamps: true
});
exports.Property = (0, mongoose_1.model)('Property', propertySchema);
