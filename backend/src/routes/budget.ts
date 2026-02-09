import { Router } from 'express';
import { getBudget, updateBudget, addLineItem } from '../controllers/budgetController';
import { authenticate } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router({ mergeParams: true });

router.use(authenticate);
router.use(apiLimiter);

router.get('/', getBudget);
router.put('/', updateBudget);
router.post('/line-items', addLineItem);

export default router;
