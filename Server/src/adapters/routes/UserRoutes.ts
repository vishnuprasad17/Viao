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
    messageController: MessageController,
    reviewController: ReviewController,
    paymentController: PaymentController

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
    //Booking
    router.post("/book-vendor", bookingController.bookVendor);
    router.get("/single-booking", bookingController.getBookingsById);
    router.get("/get-bookings", bookingController.getBookingsByUser);
    router.put("/cancel-booking", bookingController.cancelBookingByUser);
    router.get("/all-transaction-details", bookingController.getRefundDetails);
    //Chat
    router.patch("/delete-for-everyone", messageController.deleteMessage);
    router.patch("/delete-for-me", messageController.changeViewMessage);
    router.get("/getuser", userController.getUser);
    //Review
    router.post("/addVendorReview", reviewController.addReview);
    router.get("/getReviews",reviewController.getReviews);
    router.get("/checkReviews", reviewController.checkIfUserReviewed);
    router.patch("/update-review",reviewController.updateReview);
    router.delete("/delete-review",reviewController.deleteReview);
    //Payment
    router.post("/create-checkout-session", paymentController.makePayment);
    router.post("/add-payment", paymentController.addPayment);

    return router;
};