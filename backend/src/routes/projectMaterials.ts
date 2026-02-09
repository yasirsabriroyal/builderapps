import { Router } from 'express';
import {
  listProjectMaterials,
  addProjectMaterial,
  removeProjectMaterial
} from '../controllers/projectMaterialController';
import { authenticate } from '../middleware/auth';
import { validateMaterial } from '../middleware/validation';

const router = Router({ mergeParams: true });

router.use(authenticate);

router.get('/', listProjectMaterials);
router.post('/', validateMaterial, addProjectMaterial);
router.delete('/:materialId', removeProjectMaterial);

export default router;
