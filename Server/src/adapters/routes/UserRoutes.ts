import { authLimiter, otpLimiter, passwordResetLimiter, refreshTokenLimiter } from './../middlewares/ratelimitMiddleware';
import { Router} from 'express';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { otpValidityMiddleware, signupOtpValidityMiddleware } from '../middlewares/otp.expiration';
import multer from 'multer';
import { authenticate } from '../middlewares/auth';
import { AuthController } from '../../domain/interfaces/adapter interfaces/AuthController';
import { UserController } from '../../domain/interfaces/adapter interfaces/UserController';
import { VendorController } from '../../domain/interfaces/adapter interfaces/VendorController';
import { VendorTypeController } from '../../domain/interfaces/adapter interfaces/VendorTypeController';
import { PostController } from '../../domain/interfaces/adapter interfaces/PostController';
import { BookingController } from '../../domain/interfaces/adapter interfaces/BookingController';
import { NotificationController } from '../../domain/interfaces/adapter interfaces/NotificationController';
import { MessageController } from '../../domain/interfaces/adapter interfaces/MessageController';
import { PaymentController } from '../../domain/interfaces/adapter interfaces/PaymentController';
import { ReviewController } from '../../domain/interfaces/adapter interfaces/ReviewController';
import { ServiceController } from '../../domain/interfaces/adapter interfaces/ServiceController';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



export const userRoutes = (
    authController: AuthController,
    userController: UserController,
    vendorController: VendorController,
    vendorTypeController: VendorTypeController,
    postController: PostController,
    serviceController: ServiceController,
    bookingController: BookingController,
    notificationController: NotificationController,
    messageController: MessageController,
    reviewController: ReviewController,
    paymentController: PaymentController

) => {
    const router = Router();

    //Authentication routes
    router.post('/signup', authLimiter, roleMiddleware("user"), authController.signup );
    router.post("/verify", authLimiter, roleMiddleware("user"), signupOtpValidityMiddleware, authController.verifyOtp);
    router.get("/resendOtp", otpLimiter, roleMiddleware("user"), authController.resendOtp);
    router.post('/login', authLimiter, roleMiddleware("user"), authController.login);
    router.post("/getotp", passwordResetLimiter,roleMiddleware("user"), authController.forgotPassword);
    router.get("/pwd-resendOtp", otpLimiter,otpValidityMiddleware,authController.pwdResendOtp);
    router.post("/verify-otp", authLimiter, otpValidityMiddleware, authController.verifyOtpForPassword);
    router.post("/reset-password", passwordResetLimiter, roleMiddleware("user"), signupOtpValidityMiddleware, authController.resetPassword);
    router.post('/logout', roleMiddleware("user"), authController.logout)
    router.post("/refresh", refreshTokenLimiter, roleMiddleware("user"), authController.createToken);
    router.post("/google/login", authLimiter, authController.googleLogin);

    router.post("/send-message",userController.contactMessage)
    //Home
    router.get("/getvendors", vendorController.getAllVendors);
    router.get("/suggestions", vendorController.getSearchSuggestions);
    router.get("/vendor-types", vendorTypeController.getVendorTypes);
    router.get("/get-locations",vendorController.getLocations);
    router.get("/posts", postController.getPosts);
    router.get("/getvendor", vendorController.getVendor);
    router.get("/getservices", serviceController.getAllServices);
    router.post("/add-favorite-vendor", authenticate(["user"]), userController.addFavVendor);
    //Profile
    router.put("/update-profile", authenticate(["user"]), upload.single("image"), userController.updateProfile)
    router.post("/update-password", authenticate(["user"]), userController.updatePassword);
    router.get("/get-favorite-vendor", authenticate(["user"]), vendorController.getFavoriteVendors);
    router.delete("/delete-favorite-vendor", authenticate(["user"]), userController.deleteFavoriteVendor);
    //Notification
    router.get('/user-notifications', authenticate(["user"]), notificationController.getAllNotifications);
    router.patch('/toggle-read', authenticate(["user"]), notificationController.toggleRead)
    router.delete("/notification", authenticate(["user"]), notificationController.deleteNotification)
    router.get("/notification-count", authenticate(["user"]), notificationController.getCount);
    //Booking
    router.post("/book-vendor", authenticate(["user"]), bookingController.bookVendor);
    router.get("/single-booking", authenticate(["user"]), bookingController.getBookingsById);
    router.get("/get-bookings", authenticate(["user"]), bookingController.getBookingsByUser);
    router.put("/cancel-booking", authenticate(["user"]), bookingController.cancelBookingByUser);
    router.get("/all-transaction-details", authenticate(["user"]), bookingController.getWalletDetails);
    //Chat
    router.get("/getvendor", authenticate(["user"]), vendorController.getVendor);
    //Review
    router.post("/addVendorReview", authenticate(["user"]), reviewController.addReview);
    router.get("/getReviews",reviewController.getReviews);
    router.get("/checkReviews", authenticate(["user"]), reviewController.checkIfUserReviewed);
    router.patch("/update-review",authenticate(["user"]), reviewController.updateReview);
    router.delete("/delete-review", authenticate(["user"]), reviewController.deleteReview);
    //Wallet
    router.get("/load-wallet", authenticate(["user"]), userController.getWallet);
    //Payment
    router.post("/create-checkout-session", authenticate(["user"]), paymentController.makePayment);
    router.get("/add-payment", authenticate(["user"]), paymentController.addPayment);

    return router;
};