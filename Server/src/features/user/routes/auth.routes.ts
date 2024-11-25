import express from 'express';
import { UserAuthController } from '../controllers/auth';


const router = express.Router();


router.post('user/signup', UserAuthController.UserSignup );
router.post('user/login', UserAuthController.UserLogin );
router.post('user/logout' , UserAuthController.UserLogout)




export default router;