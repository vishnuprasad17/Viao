import { Router} from 'express';
import {AuthController, UserController, VendorController, VendorTypeController} from "../controllers";
import { setRole } from '../shared/middlewares/setRole';
import adminAuth from '../shared/middlewares/admin-auth';
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.post('/login', setRole("admin"), AuthController.login);
router.get('/logout', setRole("admin"), AuthController.logout)
router.post("/refresh-token", setRole("admin"), AuthController.createRefreshToken);
//user
router.get('/users' ,adminAuth, UserController.allUsers);
router.patch('/block-unblock' , UserController.Toggleblock)
//Vendor
router.patch('/vendorblock-unblock', VendorController.Toggleblock)
router.get('/getvendor',adminAuth, VendorController.getVendor)
router.get('/getvendors' ,adminAuth,VendorController.getAllVendors )
router.put('/update-verify-status',VendorController.updateVerifyStatus);
//vendorType
router.get('/vendor-types' ,adminAuth,VendorTypeController.getVendorTypes);
router.delete('/delete-vendortype',VendorTypeController.deleteVendorType)
router.post('/add-type' , upload.single("image"), VendorTypeController.addVendorType);
router.get("/single-type",adminAuth,VendorTypeController.LoadSingleType)
router.put("/update-type", upload.single("image"),VendorTypeController.updateType)



export default router;