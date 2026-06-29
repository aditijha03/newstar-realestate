"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enquiry = void 0;
const mongoose_1 = require("mongoose");
const enquirySchema = new mongoose_1.Schema({
    propertyId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Property' },
    propertyTitle: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['New', 'Contacted', 'Closed'], default: 'New' },
    createdAt: { type: Date, default: Date.now }
});
exports.Enquiry = (0, mongoose_1.model)('Enquiry', enquirySchema);
