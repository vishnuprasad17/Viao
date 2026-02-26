import { Request, Response, NextFunction } from 'express';

const OTP_VALIDITY_MS   = 2 * 60 * 1000; // 2 minutes
const GRACE_PERIOD_MS   = 5  * 1000;     // 5-second grace period to absorb network delay

// Signup / verify OTP middleware
export const signupOtpValidityMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const role = req.role;

    if (!role) {
        return res.status(400).json({ error: 'Role not specified' });
    }

    const sessionData = role === 'user' ? req.session.user : req.session.vendor;

    if (!sessionData) {
        return res.status(400).json({ error: 'Session expired. Please sign up again.' });
    }

    const elapsed = Date.now() - sessionData.otpSetTimestamp;

    // Only block when elapsed exceeds validity + grace period
    if (elapsed >= OTP_VALIDITY_MS + GRACE_PERIOD_MS) {
        sessionData.isExpired = true;
        return res.status(400).json({
            error: 'OTP has expired. Please request a new one.',
            otpExpiresAt: sessionData.otpSetTimestamp + OTP_VALIDITY_MS, // still send so client can sync
            canResend: true
        });
    }

    next();
};

// Forgot-password OTP middleware
export const otpValidityMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const otpData = req.session.otpData;

    if (!otpData) {
        return res.status(400).json({ error: 'Session expired. Please request OTP again.' });
    }

    const elapsed = Date.now() - otpData.otpSetTimestamp;

    if (elapsed >= OTP_VALIDITY_MS + GRACE_PERIOD_MS) {
        otpData.isExpired = true;
        return res.status(400).json({
            error: 'OTP has expired. Please request a new one.',
            otpExpiresAt: otpData.otpSetTimestamp + OTP_VALIDITY_MS,
            canResend: true
        });
    }

    next();
};