"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProperty = void 0;
const express_validator_1 = require("express-validator");
exports.validateProperty = [
    (0, express_validator_1.body)('title').notEmpty().withMessage('Title is required').trim(),
    (0, express_validator_1.body)('description').notEmpty().withMessage('Description is required').trim(),
    (0, express_validator_1.body)('type').notEmpty().withMessage('Type is required').trim(),
    (0, express_validator_1.body)('badge').notEmpty().withMessage('Badge is required').isIn(['FOR SALE', 'FOR RENT']).withMessage('Invalid badge'),
    (0, express_validator_1.body)('price').notEmpty().withMessage('Price text representation is required').trim(),
    (0, express_validator_1.body)('priceVal').isNumeric().withMessage('Price value must be a number'),
    (0, express_validator_1.body)('location').notEmpty().withMessage('Location is required').trim(),
    (0, express_validator_1.body)('area').notEmpty().withMessage('Area text is required').trim(),
    (0, express_validator_1.body)('areaVal').isNumeric().withMessage('Area value must be a number'),
    (0, express_validator_1.body)('furnishing').notEmpty().isIn(['Furnished', 'Semi-Furnished', 'Unfurnished']).withMessage('Invalid furnishing value'),
    (0, express_validator_1.body)('status').notEmpty().isIn(['Ready to Move', 'Under Construction', 'New Launch']).withMessage('Invalid status value'),
    (0, express_validator_1.body)('image').notEmpty().withMessage('Cover image URL is required'),
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
