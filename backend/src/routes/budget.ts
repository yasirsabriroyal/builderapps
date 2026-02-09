import { Router } from 'express';
import { getBudget, updateBudget, addLineItem } from '../controllers/budgetController';
import { authenticate } from '../middleware/auth';

const router = Router({ mergeParams: true });

router.use(authenticate);

router.get('/', getBudget);
router.put('/', updateBudget);
router.post('/line-items', addLineItem);

export default router;
