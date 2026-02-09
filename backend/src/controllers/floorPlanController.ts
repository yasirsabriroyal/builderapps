import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { FloorPlan, Project } from '../models';

export const listFloorPlans = async (req: AuthRequest, res: Response, next: NextFunction) => {
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

    const floorPlans = await FloorPlan.findAll({
      where: { projectId },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: floorPlans.length,
      floorPlans
    });
  } catch (error) {
    next(error);
  }
};

export const createFloorPlan = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { id: projectId } = req.params;
    const { name, canvasData } = req.body;

    const project = await Project.findOne({
      where: { id: projectId, userId: req.user.id }
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const floorPlan = await FloorPlan.create({
      projectId: Number(projectId),
      name,
      canvasData
    });

    res.status(201).json({
      success: true,
      floorPlan
    });
  } catch (error) {
    next(error);
  }
};

export const getFloorPlan = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { id: projectId, floorPlanId } = req.params;

    const project = await Project.findOne({
      where: { id: projectId, userId: req.user.id }
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const floorPlan = await FloorPlan.findOne({
      where: { id: floorPlanId, projectId }
    });

    if (!floorPlan) {
      throw new AppError('Floor plan not found', 404);
    }

    res.json({
      success: true,
      floorPlan
    });
  } catch (error) {
    next(error);
  }
};

export const updateFloorPlan = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { id: projectId, floorPlanId } = req.params;
    const { name, canvasData } = req.body;

    const project = await Project.findOne({
      where: { id: projectId, userId: req.user.id }
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const floorPlan = await FloorPlan.findOne({
      where: { id: floorPlanId, projectId }
    });

    if (!floorPlan) {
      throw new AppError('Floor plan not found', 404);
    }

    await floorPlan.update({
      ...(name && { name }),
      ...(canvasData && { canvasData })
    });

    res.json({
      success: true,
      floorPlan
    });
  } catch (error) {
    next(error);
  }
};
