import { Router } from 'express';
import authRoutes from './auth';
import projectRoutes from './projects';
import materialRoutes from './materials';
import materialCategoryRoutes from './materialCategories';
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
router.use('/material-categories', materialCategoryRoutes);
router.use('/projects/:id/floor-plans', floorPlanRoutes);
router.use('/projects/:id/budget', budgetRoutes);
router.use('/projects/:id/documents', documentRoutes);
router.use('/projects/:id/messages', messageRoutes);
router.use('/projects/:id/tasks', taskRoutes);
router.use('/projects/:id/materials', projectMaterialRoutes);
router.use('/projects/:id/milestones', milestoneRoutes);

export default router;
