import { param } from 'express-validator';

export const holdingIdValidation = [
  param('id').trim().notEmpty().withMessage('id is required')
];