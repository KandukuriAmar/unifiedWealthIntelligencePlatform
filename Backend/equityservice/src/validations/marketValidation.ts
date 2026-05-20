import { param } from 'express-validator';

export const symbolValidation = [
  param('symbol')
    .trim()
    .matches(/^[A-Za-z0-9_.-]{1,20}$/)
    .withMessage('symbol format is invalid')
];