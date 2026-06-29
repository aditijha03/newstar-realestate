"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEnquiry = exports.updateEnquiryStatus = exports.getAdminEnquiries = exports.createEnquiry = void 0;
const Enquiry_1 = require("../models/Enquiry");
const Property_1 = require("../models/Property");
// PUBLIC: Submit a customer enquiry
const createEnquiry = async (req, res, next) => {
    try {
        const { propertyId, propertyTitle, name, phone, email, message } = req.body;
        let linkedPropertyId = undefined;
        // Resolve propertyId from DB if possible
        if (propertyId && typeof propertyId === 'string' && propertyId.match(/^[0-9a-fA-F]{24}$/)) {
            linkedPropertyId = propertyId;
        }
        else {
            // Find property by title to link
            const prop = await Property_1.Property.findOne({ title: propertyTitle });
            if (prop) {
                linkedPropertyId = prop._id;
            }
        }
        const enquiry = new Enquiry_1.Enquiry({
            propertyId: linkedPropertyId,
            propertyTitle,
            name,
            phone,
            email,
            message,
            status: 'New'
        });
        const saved = await enquiry.save();
        res.status(201).json({ success: true, data: saved });
    }
    catch (error) {
        next(error);
    }
};
exports.createEnquiry = createEnquiry;
// ADMIN: Get all enquiries
const getAdminEnquiries = async (req, res, next) => {
    try {
        const enquiries = await Enquiry_1.Enquiry.find().sort({ createdAt: -1 });
        res.json({ success: true, data: enquiries });
    }
    catch (error) {
        next(error);
    }
};
exports.getAdminEnquiries = getAdminEnquiries;
// ADMIN: Update status (New, Contacted, Closed)
const updateEnquiryStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (status !== 'New' && status !== 'Contacted' && status !== 'Closed') {
            return res.status(400).json({ success: false, message: 'Invalid status value' });
        }
        const updated = await Enquiry_1.Enquiry.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
        if (!updated) {
            return res.status(404).json({ success: false, message: 'Enquiry not found' });
        }
        res.json({ success: true, data: updated });
    }
    catch (error) {
        next(error);
    }
};
exports.updateEnquiryStatus = updateEnquiryStatus;
// ADMIN: Delete enquiry
const deleteEnquiry = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await Enquiry_1.Enquiry.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Enquiry not found' });
        }
        res.json({ success: true, message: 'Enquiry deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteEnquiry = deleteEnquiry;
