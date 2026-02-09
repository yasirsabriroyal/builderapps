import { Router } from 'express';
import { listMaterials, getMaterialById, listCategories } from '../controllers/materialController';

const router = Router();

router.get('/', listMaterials);
router.get('/categories', listCategories);
router.get('/:id', getMaterialById);

export default router;
