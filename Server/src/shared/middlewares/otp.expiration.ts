import { Request, Response, NextFunction } from 'express';

const otpValidityMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const otpData = req.session.otp;

  // Check if OTP exists in the session
  if (!otpData) {
    res.status(400).json({ error: 'OTP not found in session. Please request a new OTP.' });
    return;
  }

  const currentTime = Date.now();
  const otpTimestamp = otpData.otpSetTimestamp;

  // Check if OTP is expired (120 seconds)
  if (currentTime - otpTimestamp > 120 * 1000) {
    console.log('OTP expired');
    req.session.otp.isExpired = true; // Mark OTP as expired
  } else {
    req.session.otp.isExpired = false; // OTP is still valid
  }

  // Proceed to the handler
  next();
};

const signupOtpValidityMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const role = req.role;
  const otpData = role === "user" ? req.session.user : req.session.vendor;

  if (!otpData) {
    console.log("No data")
    res.status(400).json({ error: 'OTP not found in session. Please request a new OTP or Signup again.' });
    return;
  }

  const currentTime = Date.now();
  const otpTimestamp = otpData.otpSetTimestamp;

  if (currentTime - otpTimestamp > 120 * 1000) {
    console.log('OTP expired');
    otpData.isExpired = true;
  } else {
    otpData.isExpired = false; // OTP is still valid
  }
  next();
}

export { otpValidityMiddleware, signupOtpValidityMiddleware };
