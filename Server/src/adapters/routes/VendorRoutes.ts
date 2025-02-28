import { Router} from 'express';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { otpValidityMiddleware, signupOtpValidityMiddleware } from '../middlewares/otp.expiration';
import multer from 'multer';
import { AuthController } from '../../domain/interfaces/adapter interfaces/AuthController';
import { VendorController } from '../../domain/interfaces/adapter interfaces/VendorController';
import { VendorTypeController } from '../../domain/interfaces/adapter interfaces/VendorTypeController';
import { PostController } from '../../domain/interfaces/adapter interfaces/PostController';
import { ServiceController } from '../../domain/interfaces/adapter interfaces/ServiceController';
import { BookingController } from '../../domain/interfaces/adapter interfaces/BookingController';
import { NotificationController } from '../../domain/interfaces/adapter interfaces/NotificationController';
import { MessageController } from '../../domain/interfaces/adapter interfaces/MessageController';
import { ReviewController } from '../../domain/interfaces/adapter interfaces/ReviewController';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



export const vendorRoutes = (
    authController: AuthController,
    vendorController: VendorController,
    vendorTypeController: VendorTypeController,
    postController: PostController,
    serviceController: ServiceController,
    bookingController: BookingController,
    notificationController: NotificationController,
    messageController: MessageController,
    reviewController: ReviewController,

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
    router.get('/getservices', serviceController.getAllServices);
    router.post("/add-dates", vendorController.addDates);
    //Service
    router.post('/add-service', serviceController.createService);
    router.patch('/update-service', serviceController.updateService);
    router.get('/services', serviceController.getServices);
    router.delete('/delete-service', serviceController.deleteService);
    //Booking
    router.get("/booking-details", bookingController.getBookingsByVendor);
    router.get("/single-booking-details", bookingController.getBookingsById);
    router.put("/update-booking-status", bookingController.updateStatus);
    //Notification
    router.get('/vendor-notifications', notificationController.getAllNotifications);
    router.patch('/toggle-read', notificationController.toggleRead)
    router.delete("/notification", notificationController.deleteNotification)
    //Message
    router.patch("/delete-for-everyone", messageController.deleteMessage);
    router.patch("/delete-for-me", messageController.changeViewMessage);
    //Review
    router.get("/reviews/statistics", reviewController.getReviewStatistics);
    router.get("/getReviews", reviewController.getReviews);
    router.put("/add-review-reply", reviewController.addReviewReply);
    //Dashboard
    router.get("/analytics", vendorController.getAnalytics);

    return router;
};