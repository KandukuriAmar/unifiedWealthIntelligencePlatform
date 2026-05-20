import { RequestHandler } from 'express';
import { verifyToken } from '../utils/tokenUtils';

const authMiddleware: RequestHandler = (req, res, next) => {
  try {
    // Try Authorization header first, then fall back to cookie
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies?.access_token) {
      token = req.cookies.access_token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token is missing'
      });
    }

    const decoded = verifyToken(token);

    req.user = {
      investor_id: decoded.investor_id,
      email: decoded.email
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

export default authMiddleware;