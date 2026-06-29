import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateProperty = [
  body('title').notEmpty().withMessage('Title is required').trim(),
  body('description').notEmpty().withMessage('Description is required').trim(),
  body('type').notEmpty().withMessage('Type is required').trim(),
  body('badge').notEmpty().withMessage('Badge is required').isIn(['FOR SALE', 'FOR RENT']).withMessage('Invalid badge'),
  body('price').notEmpty().withMessage('Price text representation is required').trim(),
  body('priceVal').isNumeric().withMessage('Price value must be a number'),
  body('location').notEmpty().withMessage('Location is required').trim(),
  body('area').notEmpty().withMessage('Area text is required').trim(),
  body('areaVal').isNumeric().withMessage('Area value must be a number'),
  body('furnishing').notEmpty().isIn(['Furnished', 'Semi-Furnished', 'Unfurnished']).withMessage('Invalid furnishing value'),
  body('status').notEmpty().isIn(['Ready to Move', 'Under Construction', 'New Launch']).withMessage('Invalid status value'),
  body('image').notEmpty().withMessage('Cover image URL is required'),
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
