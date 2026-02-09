import { Router } from 'express';
import { listMessages, createMessage } from '../controllers/messageController';
import { authenticate } from '../middleware/auth';
import { apiLimiter, createLimiter } from '../middleware/rateLimiter';

const router = Router({ mergeParams: true });

router.use(authenticate);
router.use(apiLimiter);

router.get('/', listMessages);
router.post('/', createLimiter, createMessage);

export default router;
