import { Router } from 'express';
import { listDocuments, uploadDocument, deleteDocument } from '../controllers/documentController';
import { authenticate } from '../middleware/auth';
import { apiLimiter, createLimiter } from '../middleware/rateLimiter';

const router = Router({ mergeParams: true });

router.use(authenticate);
router.use(apiLimiter);

router.get('/', listDocuments);
router.post('/', createLimiter, uploadDocument);
router.delete('/:documentId', deleteDocument);

export default router;
