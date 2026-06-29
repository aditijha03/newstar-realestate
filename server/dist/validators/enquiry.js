"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnquiry = void 0;
const express_validator_1 = require("express-validator");
exports.validateEnquiry = [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required').trim(),
    (0, express_validator_1.body)('phone').notEmpty().withMessage('Phone number is required').trim(),
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email address is required').normalizeEmail(),
    (0, express_validator_1.body)('propertyTitle').notEmpty().withMessage('Property title is required').trim(),
    (0, express_validator_1.body)('message').notEmpty().withMessage('Message is required').trim(),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array().map((err) => ({
                    field: err.type === 'field' ? err.path : '',
                    message: err.msg,
                })),
            });
        }
        next();
    },
];
