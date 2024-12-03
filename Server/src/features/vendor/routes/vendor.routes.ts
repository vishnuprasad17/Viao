import express from 'express';
import { VendorController } from '../controllers/auth';


const router = express.Router();


router.post('/vendor/signup' , VendorController.vendorSignup);
router.post('/vendor/login' , VendorController.VendorLogin)
router.get('/vendor/logout' , VendorController.VendorLogout)



export default router;