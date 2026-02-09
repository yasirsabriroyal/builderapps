import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { ProjectMaterial, Material, Project } from '../models';

export const listProjectMaterials = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id: projectId } = req.params;

    const project = await Project.findOne({
      where: { id: projectId, userId: req.user.id }
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const projectMaterials = await ProjectMaterial.findAll({
      where: { projectId },
      include: [{ model: Material, as: 'material', include: [{ association: 'category' }] }]
    });

    res.json({
      success: true,
      count: projectMaterials.length,
      materials: projectMaterials
    });
  } catch (error) {
    next(error);
  }
};

export const addProjectMaterial = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id: projectId } = req.params;
    const { materialId, quantity, room } = req.body;

    const project = await Project.findOne({
      where: { id: projectId, userId: req.user.id }
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const material = await Material.findByPk(materialId);
    if (!material) {
      throw new AppError('Material not found', 404);
    }

    const projectMaterial = await ProjectMaterial.create({
      projectId: Number(projectId),
      materialId,
      quantity,
      room
    });

    const result = await ProjectMaterial.findByPk(projectMaterial.id, {
      include: [{ model: Material, as: 'material', include: [{ association: 'category' }] }]
    });

    res.status(201).json({
      success: true,
      material: result
    });
  } catch (error) {
    next(error);
  }
};

export const removeProjectMaterial = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id: projectId, materialId } = req.params;

    const project = await Project.findOne({
      where: { id: projectId, userId: req.user.id }
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const projectMaterial = await ProjectMaterial.findOne({
      where: { id: materialId, projectId }
    });

    if (!projectMaterial) {
      throw new AppError('Project material not found', 404);
    }

    await projectMaterial.destroy();

    res.json({
      success: true,
      message: 'Material removed from project'
    });
  } catch (error) {
    next(error);
  }
};
