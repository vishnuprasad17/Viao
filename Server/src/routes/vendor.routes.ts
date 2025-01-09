import express from 'express';
import {AuthController, VendorController, VendorTypeController, PostController, NotificationController, MessageController, BookingController} from '../controllers';
import { otpValidityMiddleware, signupOtpValidityMiddleware } from '../shared/middlewares/otp.expiration';
import { setRole } from '../shared/middlewares/setRole';
import multer from 'multer';


const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const coverpicUpload = multer({ storage: multer.memoryStorage() });
const logoUpload = multer({ storage: multer.memoryStorage() });

//Authentication Routes
router.post('/signup', setRole("vendor"), AuthController.signup );
router.get("/vendor-types", VendorTypeController.getVendorTypes);
router.post("/verify", setRole("vendor"), signupOtpValidityMiddleware, AuthController.verifyOtp);
router.get("/resendOtp", setRole("vendor"), signupOtpValidityMiddleware, AuthController.ResendOtp);
router.post('/login', setRole("vendor"), AuthController.login);
router.post("/getotp", setRole("vendor"), AuthController.forgotPassword);
router.get("/pwd-resendOtp", otpValidityMiddleware,AuthController.PwdResendOtp);
router.post("/verify-otp", otpValidityMiddleware, AuthController.VerifyOtpForPassword);
router.post("/reset-password", setRole("vendor"), AuthController.ResetPassword);
router.get('/logout', setRole("vendor"), AuthController.logout)
router.post("/refresh-token", setRole("vendor"), AuthController.createRefreshToken);

//Profile
router.get("/getvendor", VendorController.getVendor);
router.post("/verification-request", VendorController.sendVerifyRequest);
router.put(
    "/update-profile",
    upload.fields([
      { name: "coverpic", maxCount: 1 },
      { name: "logo", maxCount: 1 },
    ]),
    VendorController.updateProfile
  );
router.patch("/update-password", VendorController.updatePassword);
router.get("/posts", PostController.getPosts);
router.delete("/posts/:id", PostController.deletePost);
router.post("/add-post", upload.single("image"), PostController.addNewPost);
router.get("/load-dates", VendorController.loadDates);
router.post("/add-dates", VendorController.addDates);
router.get("/booking-details", BookingController.getBookingsByVendor);
//Notification
router.get('/vendor-notifications',NotificationController.getAllNotifications);
router.patch('/toggle-read',NotificationController.toggleRead)
router.delete("/notification",NotificationController.deleteNotification)
//Message
router.patch("/delete-for-everyone", MessageController.deleteAMessage);
router.patch("/delete-for-me", MessageController.changeViewMessage);


export default router;