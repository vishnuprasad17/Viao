import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { BaseError } from '../../domain/errors/BaseError';
import dotenv from 'dotenv';
import redisClient from '../../infrastructure/config/redis';
import { TokenPayload } from '../../domain/interfaces/TokenService';

dotenv.config();

interface AuthenticatedRequest extends Request {
    User: TokenPayload
  }
// Updated auth middleware
export const authenticate = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ message: 'No token provided' });

      // Verify JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;

      // Role check
      if (!allowedRoles.includes(decoded.role)) {
        console.log(decoded)
        return res.status(401).json({ message: 'Invalid token' });
      }

      // Redis session check
      const storedToken = await redisClient.get(`${decoded.role}:${decoded.sessionId}`);
      if (!storedToken) return res.status(401).json({ message: 'Session expired' });

      (req as AuthenticatedRequest).User = decoded;
      next();
  };
};