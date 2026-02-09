import { Router } from 'express';
import {
  listMilestones,
  createMilestone,
  updateMilestone
} from '../controllers/milestoneController';
import { authenticate } from '../middleware/auth';

const router = Router({ mergeParams: true });

router.use(authenticate);

router.get('/', listMilestones);
router.post('/', createMilestone);
router.put('/:milestoneId', updateMilestone);

export default router;
