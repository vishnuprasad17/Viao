import { Router} from 'express';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { otpValidityMiddleware, signupOtpValidityMiddleware } from '../middlewares/otp.expiration';
import multer from 'multer';
import { authenticate } from '../middlewares/auth';
import { AuthController } from '../../domain/interfaces/AuthController';
import { UserController } from '../../domain/interfaces/UserController';
import { VendorController } from '../../domain/interfaces/VendorController';
import { VendorTypeController } from '../../domain/interfaces/VendorTypeController';
import { PostController } from '../../domain/interfaces/PostController';
import { BookingController } from '../../domain/interfaces/BookingController';
import { NotificationController } from '../../domain/interfaces/NotificationController';
import { MessageController } from '../../domain/interfaces/MessageController';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



export const userRoutes = (
    authController: AuthController,
    userController: UserController,
    vendorController: VendorController,
    vendorTypeController: VendorTypeController,
    postController: PostController,
    bookingController: BookingController,
    notificationController: NotificationController,
    messageController: MessageController

) => {
    const router = Router();

    //Authentication routes
    router.post('/signup', roleMiddleware("user"), authController.signup );
    router.post("/verify", roleMiddleware("user"), signupOtpValidityMiddleware, authController.verifyOtp);
    router.get("/resendOtp", roleMiddleware("user"), authController.resendOtp);
    router.post('/login', roleMiddleware("user"), authController.login);
    router.post("/getotp", roleMiddleware("user"), authController.forgotPassword);
    router.get("/pwd-resendOtp", otpValidityMiddleware,authController.pwdResendOtp);
    router.post("/verify-otp", otpValidityMiddleware, authController.verifyOtpForPassword);
    router.post("/reset-password", roleMiddleware("user"), signupOtpValidityMiddleware, authController.resetPassword);
    router.post('/logout', roleMiddleware("user"), authController.logout)
    router.post("/refresh", roleMiddleware("user"), authController.createToken);
    router.post("/google/login", authController.googleLogin);
    router.post("/google/register", authController.googleRegister);

    router.post("/send-message",userController.contactMessage)
    //Home
    router.get("/getvendors", vendorController.getAllVendors);
    router.get("/vendor-types", vendorTypeController.getVendorTypes);
    router.get("/get-locations",vendorController.getLocations);
    router.get("/posts", postController.getPosts);
    router.get("/getvendor", vendorController.getVendor);
    router.post("/add-favorite-vendor", authenticate(["user"]), userController.addFavVendor);
    router.post("/book-vendor", bookingController.bookVendor);
    router.get("/get-bookings", bookingController.getBookingsByUser);
    //Profile
    router.put("/update-profile", upload.single("image"), userController.updateProfile)
    router.post("/update-password", userController.updatePassword);
    router.get("/get-favorite-vendor", vendorController.getFavoriteVendors);
    router.delete("/delete-favorite-vendor", userController.deleteFavoriteVendor);
    //Notification
    router.get('/user-notifications',notificationController.getAllNotifications);
    router.patch('/toggle-read',notificationController.toggleRead)
    router.delete("/notification",notificationController.deleteNotification)
    router.get("/notification-count", notificationController.getCount);
    //Chat
    router.patch("/delete-for-everyone", messageController.deleteMessage);
    router.patch("/delete-for-me", messageController.changeViewMessage);
    router.get("/getuser", userController.getUser);

    return router;
};