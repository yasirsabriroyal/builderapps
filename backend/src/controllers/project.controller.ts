import { Request, Response, NextFunction } from 'express';
import Project from '../models/Project.model';
import User from '../models/User.model';
import Joi from 'joi';

// Validation schema
const projectSchema = Joi.object({
  projectName: Joi.string().min(3).max(255).required(),
  projectType: Joi.string().valid('new_construction', 'renovation', 'addition', 'remodel').required(),
  address: Joi.string().max(500).optional(),
  lotSizeSqft: Joi.number().min(0).optional(),
  budgetMin: Joi.number().min(0).optional(),
  budgetMax: Joi.number().min(0).optional(),
  description: Joi.string().optional(),
  startDate: Joi.date().optional(),
  estimatedCompletionDate: Joi.date().optional()
});

export const getProjects = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where: any = { ownerId: req.user.userId };
    if (status) {
      where.status = status;
    }

    const { count, rows } = await Project.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
      include: [{ model: User, as: 'owner', attributes: ['id', 'firstName', 'lastName', 'email'] }]
    });

    res.json({
      success: true,
      data: {
        projects: rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getProject = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const project = await Project.findOne({
      where: { id, ownerId: req.user.userId },
      include: [{ model: User, as: 'owner', attributes: ['id', 'firstName', 'lastName', 'email'] }]
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: { message: 'Project not found' }
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req: any, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const { error, value } = projectSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: { message: error.details[0].message }
      });
    }

    // Create project
    const project = await Project.create({
      ...value,
      ownerId: req.user.userId
    });

    // Fetch with owner info
    const projectWithOwner = await Project.findByPk(project.id, {
      include: [{ model: User, as: 'owner', attributes: ['id', 'firstName', 'lastName', 'email'] }]
    });

    res.status(201).json({
      success: true,
      data: projectWithOwner
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const project = await Project.findOne({
      where: { id, ownerId: req.user.userId }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: { message: 'Project not found' }
      });
    }

    await project.update(req.body);

    const updatedProject = await Project.findByPk(project.id, {
      include: [{ model: User, as: 'owner', attributes: ['id', 'firstName', 'lastName', 'email'] }]
    });

    res.json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const project = await Project.findOne({
      where: { id, ownerId: req.user.userId }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: { message: 'Project not found' }
      });
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
