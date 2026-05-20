import { Response } from 'express';

export const sendSuccess = <T>(res: Response, message: string, data: T, statusCode = 200): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const sendError = (res: Response, message: string, statusCode = 500, data: unknown = null): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    data
  });
};