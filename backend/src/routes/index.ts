import { Router } from 'express';
import authRoutes from './auth';
import projectRoutes from './projects';
import materialRoutes from './materials';
import floorPlanRoutes from './floorPlans';
import budgetRoutes from './budget';
import documentRoutes from './documents';
import messageRoutes from './messages';
import taskRoutes from './tasks';
import projectMaterialRoutes from './projectMaterials';
import milestoneRoutes from './milestones';

const router = Router();

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/materials', materialRoutes);
router.use('/material-categories', materialRoutes);
router.use('/projects/:id/floor-plans', floorPlanRoutes);
router.use('/projects/:id/budget', budgetRoutes);
router.use('/projects/:id/documents', documentRoutes);
router.use('/projects/:id/messages', messageRoutes);
router.use('/projects/:id/tasks', taskRoutes);
router.use('/projects/:id/materials', projectMaterialRoutes);
router.use('/projects/:id/milestones', milestoneRoutes);
router.use('/projects/:id/timeline', milestoneRoutes);

export default router;
