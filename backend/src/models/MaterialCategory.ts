import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export interface MaterialCategoryAttributes {
  id?: number;
  name: string;
  description?: string;
}

class MaterialCategory extends Model<MaterialCategoryAttributes> implements MaterialCategoryAttributes {
  public id!: number;
  public name!: string;
  public description?: string;
}

MaterialCategory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'material_categories',
    timestamps: false
  }
);

export default MaterialCategory;
