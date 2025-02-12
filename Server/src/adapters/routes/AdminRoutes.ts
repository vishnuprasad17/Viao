import { authenticate } from './../middlewares/auth';
import { Router} from 'express';
import multer from 'multer';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { AuthController } from '../../domain/interfaces/AuthController';
import { UserController } from '../../domain/interfaces/UserController';
import { VendorController } from '../../domain/interfaces/VendorController';
import { VendorTypeController } from '../../domain/interfaces/VendorTypeController';
import { NotificationController } from '../../domain/interfaces/NotificationController';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



export const adminRoutes = (
    authController: AuthController,
    userController: UserController,
    vendorController: VendorController,
    vendorTypeController: VendorTypeController,
    notificationController: NotificationController,

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
    router.get('/getvendors' , vendorController.getAllVendors )
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
    
    return router;
};