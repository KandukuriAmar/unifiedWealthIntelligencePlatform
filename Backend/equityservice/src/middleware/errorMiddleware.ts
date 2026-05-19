import { ErrorRequestHandler } from 'express';

const errorMiddleware: ErrorRequestHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Something went wrong';

  // Log full error for debugging
  console.error(`[ERROR] ${req.method} ${req.path} →`, message, error.stack || '');

  res.status(statusCode).json({
    success: false,
    message
  });
};

export default errorMiddleware;