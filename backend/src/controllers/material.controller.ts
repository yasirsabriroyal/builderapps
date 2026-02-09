import { Request, Response, NextFunction } from 'express';
import Material from '../models/Material.model';
import MaterialCategory from '../models/MaterialCategory.model';
import { Op } from 'sequelize';

export const getMaterials = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      categoryId, 
      search, 
      minPrice, 
      maxPrice, 
      available = 'true',
      page = '1', 
      limit = '20' 
    } = req.query;

    const where: any = {};
    
    if (categoryId) {
      where.categoryId = categoryId;
    }
    
    if (search) {
      where.materialName = { [Op.iLike]: `%${search}%` };
    }
    
    if (minPrice || maxPrice) {
      where.pricePerUnit = {};
      if (minPrice) where.pricePerUnit[Op.gte] = parseFloat(minPrice as string);
      if (maxPrice) where.pricePerUnit[Op.lte] = parseFloat(maxPrice as string);
    }
    
    if (available === 'true') {
      where.isAvailable = true;
    }

    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const { count, rows } = await Material.findAndCountAll({
      where,
      limit: parseInt(limit as string),
      offset,
      include: [{ model: MaterialCategory, as: 'category' }],
      order: [['materialName', 'ASC']]
    });

    res.json({
      success: true,
      data: {
        materials: rows,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: count,
          pages: Math.ceil(count / parseInt(limit as string))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMaterial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const material = await Material.findByPk(id, {
      include: [{ model: MaterialCategory, as: 'category' }]
    });

    if (!material) {
      return res.status(404).json({
        success: false,
        error: { message: 'Material not found' }
      });
    }

    res.json({
      success: true,
      data: material
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await MaterialCategory.findAll({
      where: { parentCategoryId: null },
      include: [{ model: MaterialCategory, as: 'subcategories' }],
      order: [['displayOrder', 'ASC']]
    });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};
