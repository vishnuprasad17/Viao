import express from 'express';
import VendorAuthController from '../controllers/auth';
import VendorTypeController from "../controllers/type";


const router = express.Router();

//Authentication Routes

router.post('/vendor/signup' , VendorAuthController.vendorSignup);
router.post("/vendor/verify", VendorAuthController.verifyOtp);
router.post('/vendor/login' , VendorAuthController.VendorLogin)
router.get("/vendor/resendOtp", VendorAuthController.ResendOtp);
router.get("/vendor/pwd-resendOtp", VendorAuthController.PwdResendOtp);
router.post("/vendor/refresh-token", VendorAuthController.createRefreshToken);
router.get("/vendor/vendor-types", VendorTypeController.getVendorTypes);
router.post("/vendor/vendor-getotp", VendorAuthController.VendorForgotPassword);
router.post("/vendor/verifyVendorotp", VendorAuthController.VerifyOtpForPassword);
router.post("/vendor/reset-password", VendorAuthController.ResetVendorPassword);
router.get('/vendor/vendor/logout' , VendorAuthController.VendorLogout)



export default router;