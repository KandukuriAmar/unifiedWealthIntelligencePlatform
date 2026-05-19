import { body } from 'express-validator';

export const transactionValidation = [
  body('stock_symbol')
    .trim()
    .matches(/^[A-Za-z0-9_.-]{1,20}$/)
    .withMessage('stock_symbol format is invalid'),
  body('quantity').isFloat({ gt: 0 }).withMessage('quantity must be greater than 0'),
  body('price').isFloat({ gt: 0 }).withMessage('price must be greater than 0'),
  body('exchange').optional().trim().isLength({ min: 2, max: 10 }).withMessage('exchange must be 2-10 characters')
];