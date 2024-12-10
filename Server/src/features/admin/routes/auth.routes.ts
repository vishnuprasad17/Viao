import express from 'express';
import AdminAuthController from "../controllers/auth";
const router = express.Router();

router.post('/admin/login', AdminAuthController.Adminlogin);
router.post('/admin/refresh-token' , AdminAuthController.createRefreshToken)
router.get('/admin/logout', AdminAuthController.Adminlogout);

export default router;