import { Router } from 'express';
import {
  listProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject
} from '../controllers/projectController';
import { authenticate } from '../middleware/auth';
import { validateProject } from '../middleware/validation';
import { apiLimiter, createLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(apiLimiter);
router.use(authenticate);

router.get('/', listProjects);
router.post('/', createLimiter, validateProject, createProject);
router.get('/:id', getProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
