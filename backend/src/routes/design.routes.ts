import { Router } from 'express';
import { 
  getDesigns, 
  getDesign, 
  createDesign, 
  updateDesign,
  updateFloorPlan
} from '../controllers/design.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All design routes require authentication
router.use(authenticate);

// Design routes
router.get('/projects/:projectId/designs', getDesigns);
router.get('/projects/:projectId/designs/:designId', getDesign);
router.post('/projects/:projectId/designs', createDesign);
router.patch('/projects/:projectId/designs/:designId', updateDesign);

// Floor plan routes
router.patch('/projects/:projectId/designs/:designId/floor-plans/:floorPlanId', updateFloorPlan);

export default router;
