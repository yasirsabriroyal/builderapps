import { Router } from 'express';
import {
  listMilestones,
  createMilestone,
  updateMilestone
} from '../controllers/milestoneController';
import { authenticate } from '../middleware/auth';
import { apiLimiter, createLimiter } from '../middleware/rateLimiter';

const router = Router({ mergeParams: true });

router.use(authenticate);
router.use(apiLimiter);

router.get('/', listMilestones);
router.post('/', createLimiter, createMilestone);
router.put('/:milestoneId', updateMilestone);

export default router;
