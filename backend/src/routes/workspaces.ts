import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { apiLimiter, createLimiter } from '../middleware/rateLimiter';
import {
  addWorkspaceMember,
  analyzeItemImage,
  completeAuditSession,
  createAuditSession,
  createInventoryItem,
  createWorkspace,
  listAuditSessions,
  listInventoryItems,
  listWorkspaces,
  recordAuditEntry,
  transcribeVoiceDescription,
  updateInventoryItem
} from '../controllers/inventoryAuditController';

const router = Router();

router.use(apiLimiter);
router.use(authenticate);

router.get('/', listWorkspaces);
router.post('/', createLimiter, createWorkspace);
router.post('/:workspaceId/members', createLimiter, addWorkspaceMember);

router.get('/:workspaceId/items', listInventoryItems);
router.post('/:workspaceId/items', createLimiter, createInventoryItem);
router.put('/:workspaceId/items/:itemId', updateInventoryItem);

router.post('/:workspaceId/ai/analyze-image', createLimiter, analyzeItemImage);
router.post('/:workspaceId/ai/voice-transcription', createLimiter, transcribeVoiceDescription);

router.get('/:workspaceId/audits', listAuditSessions);
router.post('/:workspaceId/audits', createLimiter, createAuditSession);
router.post('/:workspaceId/audits/:auditId/records', createLimiter, recordAuditEntry);
router.put('/:workspaceId/audits/:auditId/complete', completeAuditSession);

export default router;
