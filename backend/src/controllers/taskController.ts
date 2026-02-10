import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { Task, Project } from '../models';

export const listTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
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

    const tasks = await Task.findAll({
      where: { projectId },
      include: [{ association: 'assignee', attributes: ['id', 'firstName', 'lastName'] }],
      order: [['dueDate', 'ASC']]
    });

    res.json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { id: projectId } = req.params;
    const { title, description, assignedTo, dueDate, status, priority } = req.body;

    if (!title) {
      throw new AppError('Task title is required', 400);
    }

    const project = await Project.findOne({
      where: { id: projectId, userId: req.user.id }
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const task = await Task.create({
      projectId: Number(projectId),
      title,
      description,
      assignedTo,
      dueDate,
      status: status || 'todo',
      priority: priority || 'medium'
    });

    res.status(201).json({
      success: true,
      task
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { id: projectId, taskId } = req.params;
    const { title, description, assignedTo, dueDate, status, priority } = req.body;

    const project = await Project.findOne({
      where: { id: projectId, userId: req.user.id }
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const task = await Task.findOne({
      where: { id: taskId, projectId }
    });

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    await task.update({
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(assignedTo !== undefined && { assignedTo }),
      ...(dueDate !== undefined && { dueDate }),
      ...(status && { status }),
      ...(priority && { priority })
    });

    res.json({
      success: true,
      task
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { id: projectId, taskId } = req.params;

    const project = await Project.findOne({
      where: { id: projectId, userId: req.user.id }
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const task = await Task.findOne({
      where: { id: taskId, projectId }
    });

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    await task.destroy();

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
