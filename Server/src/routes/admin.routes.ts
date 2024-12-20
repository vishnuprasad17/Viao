import { Router} from 'express';
import {AuthController} from "../controllers";
import { setRole } from '../shared/middlewares/setRole';
const router = Router();
router.post('/login', setRole("admin"), AuthController.login);
router.get('/logout', setRole("admin"), AuthController.logout)
router.post("/refresh-token", setRole("admin"), AuthController.createRefreshToken);


export default router;