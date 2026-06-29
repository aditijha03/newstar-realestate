"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = void 0;
const express_validator_1 = require("express-validator");
exports.validateLogin = [
    (0, express_validator_1.body)('email')
        .notEmpty()
        .withMessage('Email or username is required')
        .trim(),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required'),
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
