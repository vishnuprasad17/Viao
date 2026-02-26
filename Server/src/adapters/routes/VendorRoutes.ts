import { authenticate } from './../middlewares/auth';
import { authLimiter, otpLimiter, passwordResetLimiter, refreshTokenLimiter } from './../middlewares/ratelimitMiddleware';
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
import { UserController } from '../../domain/interfaces/adapter interfaces/UserController';

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
    userController: UserController,
    reviewController: ReviewController,

) => {
    const router = Router();

    //Authentication Routes
    router.post('/signup', authLimiter, roleMiddleware("vendor"), authController.signup );
    router.get("/vendor-types", vendorTypeController.getVendorTypes);
    router.post("/verify", authLimiter, roleMiddleware("vendor"), signupOtpValidityMiddleware, authController.verifyOtp);
    router.get("/resendOtp", otpLimiter, roleMiddleware("vendor"), signupOtpValidityMiddleware, authController.resendOtp);
    router.post('/login', authLimiter, roleMiddleware("vendor"), authController.login);
    router.post("/getotp", passwordResetLimiter, roleMiddleware("vendor"), authController.forgotPassword);
    router.get("/pwd-resendOtp", otpLimiter, otpValidityMiddleware,authController.pwdResendOtp);
    router.post("/verify-otp", authLimiter, otpValidityMiddleware, authController.verifyOtpForPassword);
    router.post("/reset-password", passwordResetLimiter, roleMiddleware("vendor"), authController.resetPassword);
    router.post('/logout', roleMiddleware("vendor"), authController.logout)
    router.post("/refresh", refreshTokenLimiter, roleMiddleware("vendor"), authController.createToken);

    //Profile
    router.get("/getvendor", vendorController.getVendor);
    router.post("/verification-request", authenticate(["vendor"]), vendorController.sendVerifyRequest);
    router.put(
        "/update-profile",
        authenticate(["vendor"]),
        upload.fields([
            { name: "coverpic", maxCount: 1 },
            { name: "logo", maxCount: 1 },
        ]),
        vendorController.updateProfile
    );
    router.patch("/update-password", authenticate(["vendor"]), vendorController.updatePassword);
    router.get("/posts", postController.getPosts);
    router.delete("/posts/:id", authenticate(["vendor"]), postController.deletePost);
    router.post("/add-post", authenticate(["vendor"]), upload.single("image"), postController.addNewPost);
    router.get("/load-dates", authenticate(["vendor"]), vendorController.loadDates);
    router.get('/getservices', serviceController.getAllServices);
    router.post("/add-dates", authenticate(["vendor"]), vendorController.addDates);
    //Service
    router.post('/add-service', authenticate(["vendor"]), serviceController.createService);
    router.patch('/update-service', authenticate(["vendor"]), serviceController.updateService);
    router.get('/services', serviceController.getServices);
    router.delete('/delete-service', authenticate(["vendor"]), serviceController.deleteService);
    //Booking
    router.get("/booking-details", authenticate(["vendor"]), bookingController.getBookingsByVendor);
    router.get("/single-booking-details", authenticate(["vendor"]), bookingController.getBookingsById);
    router.put("/update-booking-status", authenticate(["vendor"]), bookingController.updateStatus);
    //Notification
    router.get('/vendor-notifications', authenticate(["vendor"]), notificationController.getAllNotifications);
    router.patch('/toggle-read', authenticate(["vendor"]), notificationController.toggleRead)
    router.delete("/notification", authenticate(["vendor"]), notificationController.deleteNotification)
    //Message
    router.get("/getuser", authenticate(["vendor"]), userController.getUser);
    //Review
    router.get("/reviews/statistics", authenticate(["vendor"]), reviewController.getReviewStatistics);
    router.get("/getReviews", authenticate(["vendor"]), reviewController.getReviews);
    router.put("/add-review-reply", authenticate(["vendor"]), reviewController.addReviewReply);
    //Dashboard
    router.get("/analytics", authenticate(["vendor"]), vendorController.getAnalytics);

    return router;
};