import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export interface MaterialAttributes {
  id?: number;
  categoryId: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  vendor?: string;
}

class Material extends Model<MaterialAttributes> implements MaterialAttributes {
  public id!: number;
  public categoryId!: number;
  public name!: string;
  public description?: string;
  public price!: number;
  public imageUrl?: string;
  public vendor?: string;
}

Material.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'material_categories',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    vendor: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'materials',
    timestamps: false
  }
);

export default Material;
