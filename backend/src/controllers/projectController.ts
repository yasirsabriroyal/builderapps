import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { Project, FloorPlan, Budget } from '../models';

export const listProjects = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const projects = await Project.findAll({
      where: { userId: req.user.id },
      include: [
        { association: 'floorPlans', attributes: ['id', 'name'] },
        { association: 'budget', attributes: ['totalBudget', 'actualCost'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { name, status, designData, budget } = req.body;

    const project = await Project.create({
      userId: req.user.id,
      name,
      status: status || 'planning',
      designData,
      budget
    });

    await Budget.create({
      projectId: project.id,
      totalBudget: budget || 0,
      actualCost: 0
    });

    res.status(201).json({
      success: true,
      project
    });
  } catch (error) {
    next(error);
  }
};

export const getProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { id } = req.params;

    const project = await Project.findOne({
      where: { id, userId: req.user.id },
      include: [
        { association: 'floorPlans' },
        { association: 'budget', include: [{ association: 'lineItems' }] },
        { association: 'milestones' },
        { association: 'tasks' },
        { association: 'materials' }
      ]
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    res.json({
      success: true,
      project
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { id } = req.params;
    const { name, status, designData, budget } = req.body;

    const project = await Project.findOne({
      where: { id, userId: req.user.id }
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    await project.update({
      ...(name && { name }),
      ...(status && { status }),
      ...(designData && { designData }),
      ...(budget && { budget })
    });

    res.json({
      success: true,
      project
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { id } = req.params;

    const project = await Project.findOne({
      where: { id, userId: req.user.id }
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    await project.destroy();

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
