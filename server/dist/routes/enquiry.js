"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const enquiry_1 = require("../controllers/enquiry");
const enquiry_2 = require("../validators/enquiry");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public route
router.post('/', enquiry_2.validateEnquiry, enquiry_1.createEnquiry);
// Admin routes
router.get('/admin/all', auth_1.authMiddleware, enquiry_1.getAdminEnquiries);
router.patch('/admin/status/:id', auth_1.authMiddleware, enquiry_1.updateEnquiryStatus);
router.delete('/admin/delete/:id', auth_1.authMiddleware, enquiry_1.deleteEnquiry);
exports.default = router;
