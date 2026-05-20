import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';

const validateRequestMiddleware: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      data: {
        errors: errors.array()
      }
    });
  }

  next();
};

export default validateRequestMiddleware;