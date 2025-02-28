import { Router } from "express";
import { container } from "../infrastructure/config/container";
import TYPES from "../domain/constants/inversifyTypes";
import { userRoutes } from "../adapters/routes/UserRoutes";
import { vendorRoutes } from "../adapters/routes/VendorRoutes";
import { conversationRoutes } from "../adapters/routes/ConversationRoutes";
import { messageRoutes } from "../adapters/routes/MessageRoutes";
import { AuthController } from "../domain/interfaces/adapter interfaces/AuthController";
import { UserController } from "../domain/interfaces/adapter interfaces/UserController";
import { VendorController } from "../domain/interfaces/adapter interfaces/VendorController";
import { VendorTypeController } from "../domain/interfaces/adapter interfaces/VendorTypeController";
import { PostController } from "../domain/interfaces/adapter interfaces/PostController";
import { ConversationController } from "../domain/interfaces/adapter interfaces/ConversationController";
import { BookingController } from "../domain/interfaces/adapter interfaces/BookingController";
import { NotificationController } from "../domain/interfaces/adapter interfaces/NotificationController";
import { MessageController } from "../domain/interfaces/adapter interfaces/MessageController";
import { PaymentController } from './../domain/interfaces/adapter interfaces/PaymentController';
import { adminRoutes } from "../adapters/routes/AdminRoutes";
import { ReviewController } from "../domain/interfaces/adapter interfaces/ReviewController";
import { AdminController } from "../domain/interfaces/adapter interfaces/AdminController";
import { ServiceController } from "../domain/interfaces/adapter interfaces/ServiceController";

const router = Router();

// Get controllers from Inversify container
const authController = container.get<AuthController>(TYPES.AuthController);
const adminController = container.get<AdminController>(TYPES.AdminController);
const userController = container.get<UserController>(TYPES.UserController);
const vendorController = container.get<VendorController>(TYPES.VendorController);
const vendorTypeController = container.get<VendorTypeController>(TYPES.TypeController);
const postController = container.get<PostController>(TYPES.PostController);
const serviceController = container.get<ServiceController>(TYPES.ServiceController);
const conversationController = container.get<ConversationController>(TYPES.ConversationController);
const bookingController = container.get<BookingController>(TYPES.BookingController);
const notificationController = container.get<NotificationController>(TYPES.NotificationController);
const messageController = container.get<MessageController>(TYPES.MessageController);
const reviewController = container.get<ReviewController>(TYPES.ReviewController);
const paymentController = container.get<PaymentController>(TYPES.PaymentController);

// Register routes
router.use("/admin", adminRoutes(
    authController,
    userController,
    vendorController,
    vendorTypeController,
    notificationController,
    paymentController,
    adminController,
    serviceController
))
router.use("/user", userRoutes(
    authController,
    userController,
    vendorController,
    vendorTypeController,
    postController,
    serviceController,
    bookingController,
    notificationController,
    messageController,
    reviewController,
    paymentController
));
router.use("/vendor", vendorRoutes(
    authController,
    vendorController,
    vendorTypeController,
    postController,
    serviceController,
    bookingController,
    notificationController,
    messageController,
    reviewController
));
router.use("/conversation", conversationRoutes(
    conversationController
));
router.use("/message", messageRoutes(
    messageController
));

export default router;