import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateEnquiry = [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('phone').notEmpty().withMessage('Phone number is required').trim(),
  body('email').isEmail().withMessage('Valid email address is required').normalizeEmail(),
  body('propertyTitle').notEmpty().withMessage('Property title is required').trim(),
  body('message').notEmpty().withMessage('Message is required').trim(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
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
