import { Router } from 'express';
import { listMessages, createMessage } from '../controllers/messageController';
import { authenticate } from '../middleware/auth';

const router = Router({ mergeParams: true });

router.use(authenticate);

router.get('/', listMessages);
router.post('/', createMessage);

export default router;
