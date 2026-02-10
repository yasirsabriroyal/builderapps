import { Router } from 'express';
import { listCategories } from '../controllers/materialController';

const router = Router();

router.get('/', listCategories);

export default router;
