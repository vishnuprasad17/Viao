import { Router} from 'express';
import multer from 'multer';
import { MessageController } from '../../domain/interfaces/adapter interfaces/MessageController';
import { authenticate } from '../middlewares/auth';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



export const messageRoutes = (
    messageController: MessageController

) => {
    const router = Router();

    router.post('/', messageController.createMessage);
    router.get('/', messageController.getMessages);
    router.patch("/changeIsRead",messageController.changeRead);
    router.patch("/delete-for-everyone", authenticate(["user", "vendor"]), messageController.deleteMessage);
    router.patch("/delete-for-me", authenticate(["user", "vendor"]), messageController.changeViewMessage);
    router.post('/upload/presigned-url', messageController.getPresignedUrl);

    return router;
};