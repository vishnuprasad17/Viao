import { Router } from "express";
import { container } from "../infrastructure/config/container";
import TYPES from "../domain/constants/inversifyTypes";
import { userRoutes } from "../adapters/routes/UserRoutes";
import { vendorRoutes } from "../adapters/routes/VendorRoutes";
import { conversationRoutes } from "../adapters/routes/ConversationRoutes";
import { messageRoutes } from "../adapters/routes/MessageRoutes";
import { AuthController } from "../domain/interfaces/AuthController";
import { UserController } from "../domain/interfaces/UserController";
import { VendorController } from "../domain/interfaces/VendorController";
import { VendorTypeController } from "../domain/interfaces/VendorTypeController";
import { PostController } from "../domain/interfaces/PostController";
import { ConversationController } from "../domain/interfaces/ConversationController";
import { BookingController } from "../domain/interfaces/BookingController";
import { NotificationController } from "../domain/interfaces/NotificationController";
import { MessageController } from "../domain/interfaces/MessageController";
import { adminRoutes } from "../adapters/routes/AdminRoutes";

const router = Router();

// Get controllers from Inversify container
const authController = container.get<AuthController>(TYPES.AuthController);
const userController = container.get<UserController>(TYPES.UserController);
const vendorController = container.get<VendorController>(TYPES.VendorController);
const vendorTypeController = container.get<VendorTypeController>(TYPES.TypeController);
const postController = container.get<PostController>(TYPES.PostController);
const conversationController = container.get<ConversationController>(TYPES.ConversationController);
const bookingController = container.get<BookingController>(TYPES.BookingController);
const notificationController = container.get<NotificationController>(TYPES.NotificationController);
const messageController = container.get<MessageController>(TYPES.MessageController);

// Register routes
router.use("/admin", adminRoutes(
    authController,
    userController,
    vendorController,
    vendorTypeController,
    notificationController
))
router.use("/user", userRoutes(
    authController,
    userController,
    vendorController,
    vendorTypeController,
    postController,
    bookingController,
    notificationController,
    messageController
));
router.use("/vendor", vendorRoutes(
    authController,
    vendorController,
    vendorTypeController,
    postController,
    bookingController,
    notificationController,
    messageController,
));
router.use("/conversation", conversationRoutes(
    conversationController
));
router.use("/message", messageRoutes(
    messageController
));

export default router;