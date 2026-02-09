import { Request, Response, NextFunction } from 'express';
import Design from '../models/Design.model';
import FloorPlan from '../models/FloorPlan.model';
import Project from '../models/Project.model';
import Joi from 'joi';

const designSchema = Joi.object({
  designName: Joi.string().min(3).max(255).required(),
  description: Joi.string().optional(),
  numBedrooms: Joi.number().min(0).optional(),
  numBathrooms: Joi.number().min(0).optional(),
  numStories: Joi.number().min(1).optional(),
  style: Joi.string().optional(),
  totalSqft: Joi.number().min(0).optional()
});

export const getDesigns = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params;

    // Verify project ownership
    const project = await Project.findOne({
      where: { id: projectId, ownerId: req.user.userId }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: { message: 'Project not found' }
      });
    }

    const designs = await Design.findAll({
      where: { projectId },
      include: [{ model: FloorPlan, as: 'floorPlans' }],
      order: [['versionNumber', 'DESC']]
    });

    res.json({
      success: true,
      data: designs
    });
  } catch (error) {
    next(error);
  }
};

export const getDesign = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { projectId, designId } = req.params;

    const design = await Design.findOne({
      where: { id: designId, projectId },
      include: [
        { model: FloorPlan, as: 'floorPlans' },
        { model: Project, as: 'project' }
      ]
    });

    if (!design) {
      return res.status(404).json({
        success: false,
        error: { message: 'Design not found' }
      });
    }

    // Verify ownership
    const project = await Project.findByPk(projectId);
    if (project?.ownerId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: { message: 'Not authorized' }
      });
    }

    res.json({
      success: true,
      data: design
    });
  } catch (error) {
    next(error);
  }
};

export const createDesign = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params;
    const { error, value } = designSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        error: { message: error.details[0].message }
      });
    }

    // Verify project ownership
    const project = await Project.findOne({
      where: { id: projectId, ownerId: req.user.userId }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: { message: 'Project not found' }
      });
    }

    // Get next version number
    const lastDesign = await Design.findOne({
      where: { projectId },
      order: [['versionNumber', 'DESC']]
    });

    const versionNumber = lastDesign ? lastDesign.versionNumber + 1 : 1;

    // Deactivate previous designs
    await Design.update(
      { isActive: false },
      { where: { projectId, isActive: true } }
    );

    // Create new design
    const design = await Design.create({
      ...value,
      projectId,
      versionNumber,
      createdBy: req.user.userId,
      isActive: true
    });

    // Create default floor plan
    await FloorPlan.create({
      designId: design.id,
      floorNumber: 1,
      floorName: 'Main Floor',
      floorData: {
        walls: [],
        doors: [],
        windows: [],
        rooms: [],
        dimensions: { width: 50, length: 50 }
      }
    });

    const designWithFloorPlans = await Design.findByPk(design.id, {
      include: [{ model: FloorPlan, as: 'floorPlans' }]
    });

    res.status(201).json({
      success: true,
      data: designWithFloorPlans
    });
  } catch (error) {
    next(error);
  }
};

export const updateDesign = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { projectId, designId } = req.params;

    const design = await Design.findOne({
      where: { id: designId, projectId }
    });

    if (!design) {
      return res.status(404).json({
        success: false,
        error: { message: 'Design not found' }
      });
    }

    // Verify ownership
    const project = await Project.findByPk(projectId);
    if (project?.ownerId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: { message: 'Not authorized' }
      });
    }

    await design.update(req.body);

    const updatedDesign = await Design.findByPk(design.id, {
      include: [{ model: FloorPlan, as: 'floorPlans' }]
    });

    res.json({
      success: true,
      data: updatedDesign
    });
  } catch (error) {
    next(error);
  }
};

export const updateFloorPlan = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { projectId, designId, floorPlanId } = req.params;
    const { floorData } = req.body;

    const floorPlan = await FloorPlan.findOne({
      where: { id: floorPlanId, designId }
    });

    if (!floorPlan) {
      return res.status(404).json({
        success: false,
        error: { message: 'Floor plan not found' }
      });
    }

    // Verify ownership
    const design = await Design.findByPk(designId, {
      include: [{ model: Project, as: 'project' }]
    });

    if (!design || (design as any).project?.ownerId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: { message: 'Not authorized' }
      });
    }

    await floorPlan.update({ floorData });

    res.json({
      success: true,
      data: floorPlan
    });
  } catch (error) {
    next(error);
  }
};
