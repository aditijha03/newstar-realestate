"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const property_1 = require("../controllers/property");
const property_2 = require("../validators/property");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public Routes
router.get('/', property_1.getProperties);
router.get('/:idOrSlug', property_1.getPropertyByIdOrSlug);
// Admin Routes (all protected via authMiddleware)
router.get('/admin/all', auth_1.authMiddleware, property_1.getAdminProperties);
router.post('/admin/create', auth_1.authMiddleware, property_2.validateProperty, property_1.createProperty);
router.put('/admin/update/:id', auth_1.authMiddleware, property_2.validateProperty, property_1.updateProperty);
router.delete('/admin/delete/:id', auth_1.authMiddleware, property_1.deleteProperty);
router.patch('/admin/toggle/:id', auth_1.authMiddleware, property_1.togglePropertyField);
exports.default = router;
