import { Router } from 'express';
import { listMaterials, getMaterialById } from '../controllers/materialController';

const router = Router();

router.get('/', listMaterials);
router.get('/:id', getMaterialById);

export default router;
