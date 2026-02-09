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

const router = Router();

router.use(authenticate);

router.get('/', listProjects);
router.post('/', validateProject, createProject);
router.get('/:id', getProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
