import { Router } from "express";
import { ConversationController } from '../controllers';

const router = Router();

router.post('/', ConversationController.createChat);
router.get('/', ConversationController.findUserchats);


export default router;