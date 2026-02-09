import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { Budget, BudgetLineItem, Project } from '../models';

export const getBudget = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id: projectId } = req.params;

    const project = await Project.findOne({
      where: { id: projectId, userId: req.user.id }
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const budget = await Budget.findOne({
      where: { projectId },
      include: [{ association: 'lineItems' }]
    });

    if (!budget) {
      throw new AppError('Budget not found', 404);
    }

    res.json({
      success: true,
      budget
    });
  } catch (error) {
    next(error);
  }
};

export const updateBudget = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id: projectId } = req.params;
    const { totalBudget, actualCost } = req.body;

    const project = await Project.findOne({
      where: { id: projectId, userId: req.user.id }
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const budget = await Budget.findOne({
      where: { projectId }
    });

    if (!budget) {
      throw new AppError('Budget not found', 404);
    }

    await budget.update({
      ...(totalBudget !== undefined && { totalBudget }),
      ...(actualCost !== undefined && { actualCost })
    });

    res.json({
      success: true,
      budget
    });
  } catch (error) {
    next(error);
  }
};

export const addLineItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id: projectId } = req.params;
    const { category, description, estimatedCost, actualCost } = req.body;

    const project = await Project.findOne({
      where: { id: projectId, userId: req.user.id }
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const budget = await Budget.findOne({
      where: { projectId }
    });

    if (!budget) {
      throw new AppError('Budget not found', 404);
    }

    const lineItem = await BudgetLineItem.create({
      budgetId: budget.id,
      category,
      description,
      estimatedCost: estimatedCost || 0,
      actualCost: actualCost || 0
    });

    res.status(201).json({
      success: true,
      lineItem
    });
  } catch (error) {
    next(error);
  }
};
