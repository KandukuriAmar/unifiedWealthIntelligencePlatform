import jwt from 'jsonwebtoken';

type TokenPayload = {
  investor_id: string;
  email: string;
};

const getJwtSecret = (): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured.');
  }

  return process.env.JWT_SECRET;
};

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '1h' });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, getJwtSecret()) as TokenPayload;
};