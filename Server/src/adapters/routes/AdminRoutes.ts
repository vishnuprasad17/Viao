import { authenticate } from './../middlewares/auth';
import { Router} from 'express';
import multer from 'multer';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { AuthController } from '../../domain/interfaces/adapter interfaces/AuthController';
import { UserController } from '../../domain/interfaces/adapter interfaces/UserController';
import { VendorController } from '../../domain/interfaces/adapter interfaces/VendorController';
import { VendorTypeController } from '../../domain/interfaces/adapter interfaces/VendorTypeController';
import { NotificationController } from '../../domain/interfaces/adapter interfaces/NotificationController';
import { PaymentController } from '../../domain/interfaces/adapter interfaces/PaymentController';
import { AdminController } from '../../domain/interfaces/adapter interfaces/AdminController';
import { ServiceController } from '../../domain/interfaces/adapter interfaces/ServiceController';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



export const adminRoutes = (
    authController: AuthController,
    userController: UserController,
    vendorController: VendorController,
    vendorTypeController: VendorTypeController,
    notificationController: NotificationController,
    paymentController: PaymentController,
    adminController: AdminController,
    serviceController: ServiceController

) => {
    const router = Router();

    router.post('/login', roleMiddleware("admin"), authController.login);
    router.post('/logout', roleMiddleware("admin"), authController.logout)
    router.post("/refresh", roleMiddleware("admin"), authController.createToken);
    //user
    router.get('/users' , authenticate(['admin']), userController.allUsers);
    router.patch('/block-unblock' , authenticate(['admin']), userController.toggleBlock)
    //Vendor
    router.patch('/vendorblock-unblock', authenticate(['admin']), vendorController.toggleBlock)
    router.get('/getvendor', authenticate(['admin']), vendorController.getVendor)
    router.get('/getvendors' , vendorController.getAllVendors );
    router.get('/getservices', serviceController.getAllServices);
    router.put('/update-verify-status', authenticate(['admin']), vendorController.updateVerifyStatus);
    //vendorType
    router.get('/vendor-types' , vendorTypeController.getVendorTypes);
    router.delete('/delete-vendortype', authenticate(['admin']), vendorTypeController.deleteVendorType)
    router.post('/add-type' , authenticate(['admin']), upload.single("image"), vendorTypeController.addVendorType);
    router.get("/single-type", vendorTypeController.loadSingleType)
    router.put("/update-type", authenticate(['admin']), upload.single("image"), vendorTypeController.updateType)
    //Notification
    router.get('/admin-notifications', notificationController.getAllNotifications);
    router.patch('/toggle-read', authenticate(['admin']), notificationController.toggleRead)
    router.delete("/notification", notificationController.deleteNotification)
    //Payment
    router.get("/load-admin-data", authenticate(['admin']), adminController.getAdminData);
    router.get("/all-payment-details", authenticate(['admin']), paymentController.getAllPayments);
    //dashboard
    router.get("/analytics",adminController.getAnalytics);
    
    return router;
};