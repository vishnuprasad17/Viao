import { Router} from 'express';
import {AuthController} from '../controllers/';
import otpValidityMiddleware from '../shared/middlewares/otp.expiration';
import { setRole } from '../shared/middlewares/setRole';


const router = Router();


router.post('/signup', setRole, AuthController.signup );
router.post("/verify", setRole, AuthController.verifyOtp);
router.post('/login', setRole, AuthController.login);
router.get("/resendOtp", setRole, AuthController.ResendOtp);
router.get("/pwd-resendOtp", otpValidityMiddleware,AuthController.PwdResendOtp);
router.post("/getotp", setRole, AuthController.forgotPassword);
router.post("/verify-otp", otpValidityMiddleware, setRole, AuthController.VerifyOtpForPassword);
router.post("/reset-password", setRole, AuthController.ResetPassword);
router.get('/logout', setRole, AuthController.logout)

export default router;