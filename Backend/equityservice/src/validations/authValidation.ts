import { body } from 'express-validator';

export const registerValidation = [
  body('full_name').trim().notEmpty().withMessage('full_name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('pan_number').trim().notEmpty().withMessage('pan_number is required'),
  body('demat_account').trim().notEmpty().withMessage('demat_account is required'),
  body('password').trim().notEmpty().withMessage('password is required')
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').trim().notEmpty().withMessage('password is required')
];

export const logoutValidation = [
  body('refresh_token').trim().notEmpty().withMessage('refresh_token is required')
];