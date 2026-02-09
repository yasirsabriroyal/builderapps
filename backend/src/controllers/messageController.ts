import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { Message, Project } from '../models';

export const listMessages = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { id: projectId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const project = await Project.findOne({
      where: { id: projectId, userId: req.user.id }
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const messages = await Message.findAll({
      where: { projectId },
      include: [{ association: 'user', attributes: ['id', 'firstName', 'lastName'] }],
      limit: Number(limit),
      offset: Number(offset),
      order: [['createdAt', 'ASC']]
    });

    res.json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    next(error);
  }
};

export const createMessage = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { id: projectId } = req.params;
    const { content } = req.body;

    if (!content) {
      throw new AppError('Message content is required', 400);
    }

    const project = await Project.findOne({
      where: { id: projectId, userId: req.user.id }
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const message = await Message.create({
      projectId: Number(projectId),
      userId: req.user.id,
      content
    });

    const messageWithUser = await Message.findByPk(message.id, {
      include: [{ association: 'user', attributes: ['id', 'firstName', 'lastName'] }]
    });

    res.status(201).json({
      success: true,
      message: messageWithUser
    });
  } catch (error) {
    next(error);
  }
};
