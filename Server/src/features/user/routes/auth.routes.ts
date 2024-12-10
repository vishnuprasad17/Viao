import express from 'express';
import UserAuthController from '../controllers/auth';


const router = express.Router();


router.post('/user/signup', UserAuthController.UserSignup );
router.post("/user/verify", UserAuthController.verifyOtp);
router.post('/user/login', UserAuthController.UserLogin );
router.get("/user/resendOtp", UserAuthController.ResendOtp);
router.get("/user/pwd-resendOtp", UserAuthController.PwdResendOtp);
router.post("/user/refresh-token", UserAuthController.createRefreshToken);
router.post("/user/getotp", UserAuthController.UserForgotPassword);
router.post("/user/verify-otp", UserAuthController.VerifyOtpForPassword);
router.post("/user/reset-password", UserAuthController.ResetUserPassword);
router.post("/user/google/login", UserAuthController.googleLogin);
router.post("/user/google/register", UserAuthController.googleRegister);
router.get('/user/logout' , UserAuthController.UserLogout)

export default router;