import { Router} from 'express';
import { MessageController } from '../controllers';

const router = Router();

router.post('/', MessageController.createMessage);
router.get('/', MessageController.getMessages);


router.patch("/changeIsRead",MessageController.changeRead)

export default router;