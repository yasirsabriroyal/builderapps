import { Router } from 'express';
import {
  listFloorPlans,
  createFloorPlan,
  getFloorPlan,
  updateFloorPlan
} from '../controllers/floorPlanController';
import { authenticate } from '../middleware/auth';
import { apiLimiter, createLimiter } from '../middleware/rateLimiter';

const router = Router({ mergeParams: true });

router.use(authenticate);
router.use(apiLimiter);

router.get('/', listFloorPlans);
router.post('/', createLimiter, createFloorPlan);
router.get('/:floorPlanId', getFloorPlan);
router.put('/:floorPlanId', updateFloorPlan);

export default router;
