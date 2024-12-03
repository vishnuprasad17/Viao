import express from 'express';
import { AdminAuthController } from '../controllers/auth';

const router = express.Router();

router.post('admin/login', AdminAuthController.Adminlogin);
router.get('admin/logout', AdminAuthController.Adminlogout);

export default router;