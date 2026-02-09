import { Router } from 'express';
import {
  listProjectMaterials,
  addProjectMaterial,
  removeProjectMaterial
} from '../controllers/projectMaterialController';
import { authenticate } from '../middleware/auth';
import { validateMaterial } from '../middleware/validation';
import { apiLimiter, createLimiter } from '../middleware/rateLimiter';

const router = Router({ mergeParams: true });

router.use(authenticate);
router.use(apiLimiter);

router.get('/', listProjectMaterials);
router.post('/', createLimiter, validateMaterial, addProjectMaterial);
router.delete('/:materialId', removeProjectMaterial);

export default router;
