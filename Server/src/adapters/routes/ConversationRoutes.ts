import { Router} from 'express';
import multer from 'multer';
import { ConversationController } from '../../domain/interfaces/ConversationController';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



export const conversationRoutes = (
    conversationController: ConversationController

) => {
    const router = Router();

    router.post('/', conversationController.createChat);
    router.get('/', conversationController.findUserchats);

    return router;
};