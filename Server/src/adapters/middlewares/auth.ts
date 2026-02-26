import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { BaseError } from '../../domain/errors/BaseError';
import { CustomJwtPayload } from '../../types/jwt';

export const authenticate = (allowedRoles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Try to get token from all possible cookie names
            let token: string | undefined;
            let detectedRole: string | undefined;

            for (const role of allowedRoles) {
                const cookieToken = req.cookies[`accessToken_${role}`];
                if (cookieToken) {
                    token = cookieToken;
                    detectedRole = role;
                    break;
                }
            }

            if (!token) {
                throw new BaseError('Authentication required', 401);
            }

            // Verify token
            const decoded = jwt.verify(
                token,
                process.env.JWT_ACCESS_SECRET!,
                {
                    issuer: 'viao-auth'
                }
            ) as CustomJwtPayload;

            if (decoded.type !== 'access') {
                throw new BaseError('Invalid token type', 401);
            }

            if (!allowedRoles.includes(decoded.role)) {
                throw new BaseError('Insufficient permissions', 403);
            }

            req.user = decoded;
            req.role = decoded.role;

            next();
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return res.status(401).json({ 
                    error: 'Token expired',
                    message: 'Invalid token' 
                });
            }
            if (error instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({ 
                    error: 'Invalid token',
                    message: 'Invalid token'
                });
            }
            if (error instanceof BaseError) {
                return res.status(error.statusCode).json({ 
                    error: error.message 
                });
            }
            return res.status(500).json({ 
                error: 'Internal server error' 
            });
        }
    };
};