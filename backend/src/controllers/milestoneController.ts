import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { Milestone, Project } from '../models';

export const listMilestones = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { id: projectId } = req.params;

    const project = await Project.findOne({
      where: { id: projectId, userId: req.user.id }
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const milestones = await Milestone.findAll({
      where: { projectId },
      order: [['dueDate', 'ASC']]
    });

    res.json({
      success: true,
      count: milestones.length,
      milestones
    });
  } catch (error) {
    next(error);
  }
};

export const createMilestone = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { id: projectId } = req.params;
    const { name, description, dueDate, status } = req.body;

    if (!name) {
      throw new AppError('Milestone name is required', 400);
    }

    const project = await Project.findOne({
      where: { id: projectId, userId: req.user.id }
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const milestone = await Milestone.create({
      projectId: Number(projectId),
      name,
      description,
      dueDate,
      status: status || 'pending'
    });

    res.status(201).json({
      success: true,
      milestone
    });
  } catch (error) {
    next(error);
  }
};

export const updateMilestone = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { id: projectId, milestoneId } = req.params;
    const { name, description, dueDate, completedDate, status } = req.body;

    const project = await Project.findOne({
      where: { id: projectId, userId: req.user.id }
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const milestone = await Milestone.findOne({
      where: { id: milestoneId, projectId }
    });

    if (!milestone) {
      throw new AppError('Milestone not found', 404);
    }

    await milestone.update({
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(dueDate !== undefined && { dueDate }),
      ...(completedDate !== undefined && { completedDate }),
      ...(status && { status })
    });

    res.json({
      success: true,
      milestone
    });
  } catch (error) {
    next(error);
  }
};
