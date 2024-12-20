import express from 'express';
import {AuthController} from '../controllers';
import { otpValidityMiddleware, signupOtpValidityMiddleware } from '../shared/middlewares/otp.expiration';
import { setRole } from '../shared/middlewares/setRole';


const router = express.Router();

//Authentication Routes
router.post('/signup', setRole("vendor"), AuthController.signup );
router.post("/verify", setRole("vendor"), signupOtpValidityMiddleware, AuthController.verifyOtp);
router.get("/resendOtp", setRole("vendor"), signupOtpValidityMiddleware, AuthController.ResendOtp);
router.post('/login', setRole("vendor"), AuthController.login);
router.post("/getotp", setRole("vendor"), AuthController.forgotPassword);
router.get("/pwd-resendOtp", otpValidityMiddleware,AuthController.PwdResendOtp);
router.post("/verify-otp", otpValidityMiddleware, AuthController.VerifyOtpForPassword);
router.post("/reset-password", setRole("vendor"), AuthController.ResetPassword);
router.get('/logout', setRole("vendor"), AuthController.logout)
router.post("/refresh-token", setRole("vendor"), AuthController.createRefreshToken);




export default router;