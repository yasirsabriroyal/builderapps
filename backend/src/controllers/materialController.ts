import { Response, NextFunction, Request } from 'express';
import { Op, WhereOptions } from 'sequelize';
import { Material, MaterialCategory } from '../models';

interface MaterialWhereConditions {
  categoryId?: number;
  [Op.or]?: Array<{
    name?: { [Op.iLike]: string };
    description?: { [Op.iLike]: string };
  }>;
  price?: {
    [Op.gte]?: number;
    [Op.lte]?: number;
  };
}

export const listMaterials = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryId, search, minPrice, maxPrice, page = 1, limit = 20 } = req.query;

    const where: MaterialWhereConditions = {};

    if (categoryId) {
      where.categoryId = Number(categoryId);
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = Number(minPrice);
      if (maxPrice) where.price[Op.lte] = Number(maxPrice);
    }

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows: materials } = await Material.findAndCountAll({
      where: where as WhereOptions,
      include: [{ association: 'category', attributes: ['id', 'name'] }],
      limit: Number(limit),
      offset,
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      count,
      page: Number(page),
      totalPages: Math.ceil(count / Number(limit)),
      materials
    });
  } catch (error) {
    next(error);
  }
};

export const getMaterialById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const material = await Material.findByPk(id, {
      include: [{ association: 'category' }]
    });

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    res.json({
      success: true,
      material
    });
  } catch (error) {
    next(error);
  }
};

export const listCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await MaterialCategory.findAll({
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    next(error);
  }
};
