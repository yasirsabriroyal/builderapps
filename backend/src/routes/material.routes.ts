import { Router } from 'express';
import { 
  getMaterials, 
  getMaterial, 
  getCategories 
} from '../controllers/material.controller';

const router = Router();

// Public routes (no authentication required for browsing materials)
router.get('/materials', getMaterials);
router.get('/materials/:id', getMaterial);
router.get('/material-categories', getCategories);

export default router;
