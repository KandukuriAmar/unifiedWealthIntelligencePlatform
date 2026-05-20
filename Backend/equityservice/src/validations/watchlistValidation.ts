import { body, param } from 'express-validator';

export const addWatchlistValidation = [
  body('stock_symbol')
    .trim()
    .matches(/^[A-Za-z0-9_.-]{1,20}$/)
    .withMessage('stock_symbol format is invalid')
];

export const watchlistIdValidation = [
  param('id').isInt({ gt: 0 }).withMessage('id must be a positive integer')
];