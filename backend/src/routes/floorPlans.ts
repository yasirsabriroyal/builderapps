import { Router } from 'express';
import {
  listFloorPlans,
  createFloorPlan,
  getFloorPlan,
  updateFloorPlan
} from '../controllers/floorPlanController';
import { authenticate } from '../middleware/auth';

const router = Router({ mergeParams: true });

router.use(authenticate);

router.get('/', listFloorPlans);
router.post('/', createFloorPlan);
router.get('/:floorPlanId', getFloorPlan);
router.put('/:floorPlanId', updateFloorPlan);

export default router;
