import { Router} from 'express';
import {
    AuthController,
    UserController,
    VendorController,
    VendorTypeController,
    PostController,
    NotificationController,
    MessageController,
    BookingController,
  } from "../controllers/";
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
router.post("/google/login", AuthController.googleLogin);
router.post("/google/register", AuthController.googleRegister);

router.post("/send-message",UserController.contactMessage)
//Home
router.get("/getvendors", VendorController.getAllVendors);
router.get("/vendor-types", VendorTypeController.getVendorTypes);
router.get("/get-locations",VendorController.getLocations);
router.get("/posts", PostController.getPosts);
router.get("/getvendor", VendorController.getVendor);
router.post("/add-favorite-vendor", UserController.AddFavVendor);
router.post("/book-vendor", BookingController.bookVendor);
router.get("/get-bookings", BookingController.getBookingsByUser);
//Profile
router.put("/update-profile", upload.single("image"), UserController.updateProfile)
router.post("/update-password", UserController.updatePassword);
router.get("/get-favorite-vendor", UserController.getFavoriteVendors);
router.delete("/delete-favorite-vendor", UserController.deleteFavoriteVendor);
//Notification
router.get('/user-notifications',NotificationController.getAllNotifications);
router.patch('/toggle-read',NotificationController.toggleRead)
router.delete("/notification",NotificationController.deleteNotification)
router.get("/notification-count", NotificationController.getCount);
//Chat
router.patch("/delete-for-everyone", MessageController.deleteAMessage);
router.patch("/delete-for-me", MessageController.changeViewMessage);
router.get("/getuser", UserController.getUser);

export default router;