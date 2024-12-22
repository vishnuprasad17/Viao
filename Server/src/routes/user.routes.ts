import { Router} from 'express';
import {AuthController, UserController} from '../controllers/';
import { setRole } from '../shared/middlewares/setRole';
import { otpValidityMiddleware, signupOtpValidityMiddleware } from '../shared/middlewares/otp.expiration';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const router = Router();

//Authentication routes
router.post('/signup', setRole("user"), AuthController.signup );
router.post("/verify", setRole("user"), signupOtpValidityMiddleware, AuthController.verifyOtp);
router.get("/resendOtp", setRole("user"), AuthController.ResendOtp);
router.post('/login', setRole("user"), AuthController.login);
router.post("/getotp", setRole("user"), AuthController.forgotPassword);
router.get("/pwd-resendOtp", otpValidityMiddleware,AuthController.PwdResendOtp);
router.post("/verify-otp", otpValidityMiddleware, AuthController.VerifyOtpForPassword);
router.post("/reset-password", setRole("user"), signupOtpValidityMiddleware, AuthController.ResetPassword);
router.get('/logout', setRole("user"), AuthController.logout)
router.post("/refresh-token", setRole("user"), AuthController.createRefreshToken);
router.post("/user/google/login", AuthController.googleLogin);
router.post("/user/google/register", AuthController.googleRegister);

router.post("/send-message",UserController.contactMessage)

//Profile
router.put("/update-profile", upload.single("image"), UserController.updateProfile)
router.post("/update-password", UserController.updatePassword);
router.get("/get-favorite-vendor", UserController.getFavoriteVendors);
router.delete("/delete-favorite-vendor", UserController.deleteFavoriteVendor);

export default router;