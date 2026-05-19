import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import { sendSuccess } from '../utils/apiResponse';

const isProduction = process.env.NODE_ENV === 'production';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,       // false in dev so http://localhost works
  sameSite: 'lax' as const,
  path: '/'
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await authService.registerInvestor(req.body);
    sendSuccess(res, 'Registration successful', result, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await authService.loginInvestor(req.body);

    // Set access_token cookie (1 hour)
    res.cookie('access_token', result.access_token, {
      ...COOKIE_OPTIONS,
      maxAge: 60 * 60 * 1000 // 1 hour in ms
    });

    // Set refresh_token cookie (7 days)
    res.cookie('refresh_token', result.refresh_token, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
    });

    sendSuccess(res, 'Login successful', result, 200);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await authService.logoutInvestor(req.body);

    // Clear both cookies on logout
    res.clearCookie('access_token', COOKIE_OPTIONS);
    res.clearCookie('refresh_token', COOKIE_OPTIONS);

    sendSuccess(res, 'Logout successful', result, 200);
  } catch (error) {
    next(error);
  }
};