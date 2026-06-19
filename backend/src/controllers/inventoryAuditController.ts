import { NextFunction, Response } from 'express';
import { Op } from 'sequelize';
import {
  AuditEntry,
  AuditSession,
  InventoryItem,
  User,
  Workspace,
  WorkspaceMember
} from '../models';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { WorkspaceRole } from '../models/WorkspaceMember';

const workspaceWriteRoles: WorkspaceRole[] = ['owner', 'admin'];
const auditWriteRoles: WorkspaceRole[] = ['owner', 'admin', 'auditor'];

const normalizeSlug = (name: string) => {
  const trimmed = name.toLowerCase().trim();
  let slug = '';
  let previousWasDash = false;

  for (const character of trimmed) {
    const isAlphaNumeric =
      (character >= 'a' && character <= 'z') || (character >= '0' && character <= '9');

    if (isAlphaNumeric) {
      slug += character;
      previousWasDash = false;
      continue;
    }

    if (slug.length > 0 && !previousWasDash) {
      slug += '-';
      previousWasDash = true;
    }
  }

  if (slug.endsWith('-')) {
    slug = slug.slice(0, -1);
  }

  return slug.slice(0, 60);
};

const createUniqueSlug = async (name: string) => {
  const baseSlug = normalizeSlug(name) || 'workspace';
  let candidate = baseSlug;
  let suffix = 1;

  while (await Workspace.findOne({ where: { slug: candidate } })) {
    suffix += 1;
    candidate = `${baseSlug}-${suffix}`;
  }

  return candidate;
};

const buildItemCode = (workspaceId: number, itemName: string) => {
  const prefix = itemName
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '')
    .slice(0, 3)
    .padEnd(3, 'X');
  return `WS${workspaceId}-${prefix}-${Date.now().toString().slice(-6)}`;
};

const requireUser = (req: AuthRequest) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }

  return req.user;
};

const getWorkspaceMembership = async (workspaceId: number, userId: number) => {
  const member = await WorkspaceMember.findOne({
    where: { workspaceId, userId },
    include: [{ association: 'workspace' }]
  });

  if (!member) {
    throw new AppError('Workspace not found or access denied', 404);
  }

  return member;
};

const ensureRole = (role: WorkspaceRole, allowedRoles: WorkspaceRole[]) => {
  if (!allowedRoles.includes(role)) {
    throw new AppError('Forbidden: insufficient workspace permissions', 403);
  }
};

const toWorkspaceId = (value: string) => {
  const workspaceId = Number(value);
  if (!Number.isInteger(workspaceId) || workspaceId <= 0) {
    throw new AppError('Invalid workspace id', 400);
  }
  return workspaceId;
};

const generateImagePrefill = (source: string) => {
  const normalized = source.toLowerCase();

  const name = normalized.includes('drill')
    ? 'Cordless Drill'
    : normalized.includes('helmet')
    ? 'Safety Helmet'
    : normalized.includes('wrench')
    ? 'Adjustable Wrench'
    : normalized.includes('ladder')
    ? 'Extension Ladder'
    : 'Unclassified Tool';

  const category = normalized.includes('ppe') || normalized.includes('helmet') ? 'PPE' : 'Tools';
  const condition = normalized.includes('rust') || normalized.includes('damage') ? 'fair' : 'good';
  const brand = normalized.includes('dewalt') ? 'DeWalt' : normalized.includes('bosch') ? 'Bosch' : undefined;
  const model = normalized.includes('xr') ? 'XR Series' : undefined;

  const confidence = brand || model ? 0.86 : 0.71;

  return {
    suggestions: {
      name,
      category,
      brand,
      model,
      condition,
      status: 'available' as const
    },
    confidence,
    requiresManualReview: true
  };
};

export const listWorkspaces = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = requireUser(req);

    const memberships = await WorkspaceMember.findAll({
      where: { userId: user.id },
      include: [{ association: 'workspace' }],
      order: [['createdAt', 'ASC']]
    });

    res.json({
      success: true,
      workspaces: memberships
    });
  } catch (error) {
    next(error);
  }
};

export const createWorkspace = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = requireUser(req);
    const { name, plan = 'starter' } = req.body;

    if (!name || typeof name !== 'string') {
      throw new AppError('Workspace name is required', 400);
    }

    const slug = await createUniqueSlug(name);

    const workspace = await Workspace.create({
      name: name.trim(),
      slug,
      ownerUserId: user.id,
      plan,
      isActive: true
    });

    await WorkspaceMember.create({
      workspaceId: workspace.id,
      userId: user.id,
      role: 'owner'
    });

    res.status(201).json({
      success: true,
      workspace
    });
  } catch (error) {
    next(error);
  }
};

export const addWorkspaceMember = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = requireUser(req);
    const workspaceId = toWorkspaceId(req.params.workspaceId);
    const { userId, role = 'member' } = req.body;

    if (!userId || !Number.isInteger(Number(userId))) {
      throw new AppError('Valid userId is required', 400);
    }

    if (!['owner', 'admin', 'auditor', 'member'].includes(role)) {
      throw new AppError('Invalid role value', 400);
    }

    const membership = await getWorkspaceMembership(workspaceId, user.id);
    ensureRole(membership.role, workspaceWriteRoles);

    const existingUser = await User.findByPk(Number(userId));
    if (!existingUser) {
      throw new AppError('User not found', 404);
    }

    const [member, created] = await WorkspaceMember.findOrCreate({
      where: { workspaceId, userId: Number(userId) },
      defaults: {
        workspaceId,
        userId: Number(userId),
        role
      }
    });

    if (!created) {
      await member.update({ role });
    }

    res.status(created ? 201 : 200).json({
      success: true,
      member
    });
  } catch (error) {
    next(error);
  }
};

export const listInventoryItems = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = requireUser(req);
    const workspaceId = toWorkspaceId(req.params.workspaceId);
    const { category, status, search, location } = req.query;

    await getWorkspaceMembership(workspaceId, user.id);

    const where: {
      workspaceId: number;
      category?: string;
      status?: string;
      location?: string;
      [Op.or]?: Array<{ name?: { [Op.iLike]: string }; description?: { [Op.iLike]: string } }>;
    } = { workspaceId };

    if (typeof category === 'string' && category.trim()) {
      where.category = category;
    }

    if (typeof status === 'string' && status.trim()) {
      where.status = status;
    }

    if (typeof location === 'string' && location.trim()) {
      where.location = location;
    }

    if (typeof search === 'string' && search.trim()) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const items = await InventoryItem.findAll({
      where,
      order: [['updatedAt', 'DESC']]
    });

    res.json({
      success: true,
      count: items.length,
      items
    });
  } catch (error) {
    next(error);
  }
};

export const createInventoryItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = requireUser(req);
    const workspaceId = toWorkspaceId(req.params.workspaceId);

    const membership = await getWorkspaceMembership(workspaceId, user.id);
    ensureRole(membership.role, workspaceWriteRoles);

    const {
      name,
      category,
      brand,
      model,
      serialNumber,
      quantity = 1,
      unit = 'pcs',
      condition = 'good',
      status = 'available',
      location,
      assignedTo,
      description,
      imageUrl,
      aiConfidence
    } = req.body;

    if (!name || !category) {
      throw new AppError('name and category are required', 400);
    }

    const item = await InventoryItem.create({
      workspaceId,
      createdBy: user.id,
      itemCode: buildItemCode(workspaceId, name),
      name,
      category,
      brand,
      model,
      serialNumber,
      quantity: Number(quantity),
      unit,
      condition,
      status,
      location,
      assignedTo,
      description,
      imageUrl,
      aiConfidence
    });

    res.status(201).json({
      success: true,
      item
    });
  } catch (error) {
    next(error);
  }
};

export const updateInventoryItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = requireUser(req);
    const workspaceId = toWorkspaceId(req.params.workspaceId);
    const itemId = Number(req.params.itemId);

    const membership = await getWorkspaceMembership(workspaceId, user.id);
    ensureRole(membership.role, workspaceWriteRoles);

    const item = await InventoryItem.findOne({ where: { id: itemId, workspaceId } });

    if (!item) {
      throw new AppError('Inventory item not found', 404);
    }

    await item.update({ ...req.body });

    res.json({
      success: true,
      item
    });
  } catch (error) {
    next(error);
  }
};

export const analyzeItemImage = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = requireUser(req);
    const workspaceId = toWorkspaceId(req.params.workspaceId);
    const { imageUrl, hintDescription } = req.body;

    await getWorkspaceMembership(workspaceId, user.id);

    if (!imageUrl && !hintDescription) {
      throw new AppError('Provide imageUrl or hintDescription for analysis', 400);
    }

    const source = `${imageUrl || ''} ${hintDescription || ''}`.trim();
    const result = generateImagePrefill(source);

    res.json({
      success: true,
      analysis: result,
      integrationBoundary: {
        provider: 'vision-adapter',
        status: 'placeholder',
        notes: 'Replace with cloud vision provider in production.'
      }
    });
  } catch (error) {
    next(error);
  }
};

export const transcribeVoiceDescription = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = requireUser(req);
    const workspaceId = toWorkspaceId(req.params.workspaceId);
    const { rawText } = req.body;

    await getWorkspaceMembership(workspaceId, user.id);

    if (!rawText || typeof rawText !== 'string') {
      throw new AppError('rawText is required for transcription', 400);
    }

    const transcription = rawText
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/(^\w|[.!?]\s+\w)/g, segment => segment.toUpperCase());

    res.json({
      success: true,
      transcription,
      confidence: 0.94,
      integrationBoundary: {
        provider: 'speech-to-text-adapter',
        status: 'placeholder',
        notes: 'Replace with streaming transcription provider in production.'
      }
    });
  } catch (error) {
    next(error);
  }
};

export const listAuditSessions = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = requireUser(req);
    const workspaceId = toWorkspaceId(req.params.workspaceId);

    await getWorkspaceMembership(workspaceId, user.id);

    const sessions = await AuditSession.findAll({
      where: { workspaceId },
      include: [{ association: 'entries' }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: sessions.length,
      sessions
    });
  } catch (error) {
    next(error);
  }
};

export const createAuditSession = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = requireUser(req);
    const workspaceId = toWorkspaceId(req.params.workspaceId);
    const { name } = req.body;

    const membership = await getWorkspaceMembership(workspaceId, user.id);
    ensureRole(membership.role, auditWriteRoles);

    if (!name || typeof name !== 'string') {
      throw new AppError('Audit session name is required', 400);
    }

    const session = await AuditSession.create({
      workspaceId,
      name,
      status: 'in-progress',
      startedBy: user.id,
      startedAt: new Date()
    });

    res.status(201).json({
      success: true,
      session
    });
  } catch (error) {
    next(error);
  }
};

export const recordAuditEntry = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = requireUser(req);
    const workspaceId = toWorkspaceId(req.params.workspaceId);
    const auditId = Number(req.params.auditId);
    const { itemId, countedQuantity, notes, evidenceImageUrl } = req.body;

    const membership = await getWorkspaceMembership(workspaceId, user.id);
    ensureRole(membership.role, auditWriteRoles);

    if (!itemId || countedQuantity === undefined) {
      throw new AppError('itemId and countedQuantity are required', 400);
    }

    const session = await AuditSession.findOne({ where: { id: auditId, workspaceId } });
    if (!session) {
      throw new AppError('Audit session not found', 404);
    }

    if (session.status === 'completed') {
      throw new AppError('Cannot edit entries for completed audit session', 400);
    }

    const item = await InventoryItem.findOne({ where: { id: Number(itemId), workspaceId } });
    if (!item) {
      throw new AppError('Inventory item not found', 404);
    }

    const expectedQuantity = item.quantity;
    const counted = Number(countedQuantity);
    const discrepancy = counted - expectedQuantity;

    const [entry, created] = await AuditEntry.findOrCreate({
      where: { auditSessionId: session.id, itemId: item.id },
      defaults: {
        auditSessionId: session.id,
        itemId: item.id,
        recordedBy: user.id,
        expectedQuantity,
        countedQuantity: counted,
        discrepancy,
        notes,
        evidenceImageUrl
      }
    });

    if (!created) {
      await entry.update({
        recordedBy: user.id,
        expectedQuantity,
        countedQuantity: counted,
        discrepancy,
        notes,
        evidenceImageUrl
      });
    }

    await item.update({ lastAuditAt: new Date() });

    res.status(created ? 201 : 200).json({
      success: true,
      entry,
      discrepancy
    });
  } catch (error) {
    next(error);
  }
};

export const completeAuditSession = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = requireUser(req);
    const workspaceId = toWorkspaceId(req.params.workspaceId);
    const auditId = Number(req.params.auditId);

    const membership = await getWorkspaceMembership(workspaceId, user.id);
    ensureRole(membership.role, auditWriteRoles);

    const session = await AuditSession.findOne({ where: { id: auditId, workspaceId } });
    if (!session) {
      throw new AppError('Audit session not found', 404);
    }

    await session.update({
      status: 'completed',
      completedAt: new Date()
    });

    res.json({
      success: true,
      session
    });
  } catch (error) {
    next(error);
  }
};
