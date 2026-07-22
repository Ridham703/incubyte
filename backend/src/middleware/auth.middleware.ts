import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const protect = (req: AuthRequest, _res: Response, next: NextFunction): void => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Authentication failed: No token provided', 401));
  }

  try {
    const secret = process.env.JWT_SECRET || 'fallback_secret_key';
    const decoded = jwt.verify(token, secret) as { id: string; role: string };
    req.user = decoded;
    next();
  } catch (error) {
    return next(new AppError('Authentication failed: Invalid or expired token', 401));
  }
};
