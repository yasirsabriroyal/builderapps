import { Router } from 'express';
import { listDocuments, uploadDocument, deleteDocument } from '../controllers/documentController';
import { authenticate } from '../middleware/auth';

const router = Router({ mergeParams: true });

router.use(authenticate);

router.get('/', listDocuments);
router.post('/', uploadDocument);
router.delete('/:documentId', deleteDocument);

export default router;
