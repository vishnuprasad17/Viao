import { Router} from 'express';
import multer from 'multer';
import { MessageController } from '../../domain/interfaces/MessageController';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



export const messageRoutes = (
    messageController: MessageController

) => {
    const router = Router();

    router.post('/', messageController.createMessage);
    router.get('/', messageController.getMessages);
    router.patch("/changeIsRead",messageController.changeRead)

    return router;
};