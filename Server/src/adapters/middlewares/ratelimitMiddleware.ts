import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// Rate limiter for authentication endpoints
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many authentication attempts. Please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
        res.status(429).json({
            error: 'Too many requests',
            message: 'Too many authentication attempts. Please try again in 15 minutes.',
            retryAfter: 15 * 60 // seconds
        });
    }
});

// Rate limiter for OTP endpoints
export const otpLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 3, // Limit each IP to 3 OTP requests per 5 minutes
    message: 'Too many OTP requests. Please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    handler: (req: Request, res: Response) => {
        res.status(429).json({
            error: 'Too many requests',
            message: 'Too many OTP requests. Please try again in 5 minutes.',
            retryAfter: 5 * 60 // seconds
        });
    }
});

// Rate limiter for password reset endpoints
export const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Limit each IP to 3 password reset attempts per hour
    message: 'Too many password reset attempts. Please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
        res.status(429).json({
            error: 'Too many requests',
            message: 'Too many password reset attempts. Please try again in 1 hour.',
            retryAfter: 60 * 60 // seconds
        });
    }
});

// Strict rate limiter for token refresh
export const refreshTokenLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 refresh attempts per 15 minutes
    message: 'Too many token refresh attempts. Please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
        res.status(429).json({
            error: 'Too many requests',
            message: 'Too many token refresh attempts. Please try again later.',
            retryAfter: 15 * 60 // seconds
        });
    }
});