import { body } from 'express-validator';

export const registerValidation = [
  body('full_name')
    .trim()
    .notEmpty()
    .withMessage('Full name is required'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required'),
  body('pan_number')
    .trim()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i)
    .withMessage('Valid PAN number is required'),
  body('demat_account')
    .trim()
    .isNumeric()
    .isLength({ min: 16, max: 16 })
    .withMessage('Demat account must be exactly 16 digits'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

export const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];
