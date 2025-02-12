import { Router} from 'express';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { otpValidityMiddleware, signupOtpValidityMiddleware } from '../middlewares/otp.expiration';
import multer from 'multer';
import { AuthController } from '../../domain/interfaces/AuthController';
import { VendorController } from '../../domain/interfaces/VendorController';
import { VendorTypeController } from '../../domain/interfaces/VendorTypeController';
import { PostController } from '../../domain/interfaces/PostController';
import { BookingController } from '../../domain/interfaces/BookingController';
import { NotificationController } from '../../domain/interfaces/NotificationController';
import { MessageController } from '../../domain/interfaces/MessageController';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



export const vendorRoutes = (
    authController: AuthController,
    vendorController: VendorController,
    vendorTypeController: VendorTypeController,
    postController: PostController,
    bookingController: BookingController,
    notificationController: NotificationController,
    messageController: MessageController

) => {
    const router = Router();

    //Authentication Routes
    router.post('/signup', roleMiddleware("vendor"), authController.signup );
    router.get("/vendor-types", vendorTypeController.getVendorTypes);
    router.post("/verify", roleMiddleware("vendor"), signupOtpValidityMiddleware, authController.verifyOtp);
    router.get("/resendOtp", roleMiddleware("vendor"), signupOtpValidityMiddleware, authController.resendOtp);
    router.post('/login', roleMiddleware("vendor"), authController.login);
    router.post("/getotp", roleMiddleware("vendor"), authController.forgotPassword);
    router.get("/pwd-resendOtp", otpValidityMiddleware,authController.pwdResendOtp);
    router.post("/verify-otp", otpValidityMiddleware, authController.verifyOtpForPassword);
    router.post("/reset-password", roleMiddleware("vendor"), authController.resetPassword);
    router.post('/logout', roleMiddleware("vendor"), authController.logout)
    router.post("/refresh", roleMiddleware("vendor"), authController.createToken);

    //Profile
    router.get("/getvendor", vendorController.getVendor);
    router.post("/verification-request", vendorController.sendVerifyRequest);
    router.put(
        "/update-profile",
        upload.fields([
            { name: "coverpic", maxCount: 1 },
            { name: "logo", maxCount: 1 },
        ]),
        vendorController.updateProfile
    );
    router.patch("/update-password", vendorController.updatePassword);
    router.get("/posts", postController.getPosts);
    router.delete("/posts/:id", postController.deletePost);
    router.post("/add-post", upload.single("image"), postController.addNewPost);
    router.get("/load-dates", vendorController.loadDates);
    router.post("/add-dates", vendorController.addDates);
    router.get("/booking-details", bookingController.getBookingsByVendor);
    //Notification
    router.get('/vendor-notifications',notificationController.getAllNotifications);
    router.patch('/toggle-read',notificationController.toggleRead)
    router.delete("/notification",notificationController.deleteNotification)
    //Message
    router.patch("/delete-for-everyone", messageController.deleteMessage);
    router.patch("/delete-for-me", messageController.changeViewMessage);

    return router;
};