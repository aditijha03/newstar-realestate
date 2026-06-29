"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error(err.stack || err);
    const status = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const errors = err.errors || [];
    res.status(status).json({
        success: false,
        message,
        errors,
    });
};
exports.errorHandler = errorHandler;
