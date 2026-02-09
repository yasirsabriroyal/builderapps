import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface MaterialCategoryAttributes {
  id: string;
  categoryName: string;
  parentCategoryId?: string;
  description?: string;
  displayOrder: number;
  iconUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface MaterialCategoryCreationAttributes extends Optional<MaterialCategoryAttributes, 'id' | 'displayOrder'> {}

class MaterialCategory extends Model<MaterialCategoryAttributes, MaterialCategoryCreationAttributes> implements MaterialCategoryAttributes {
  public id!: string;
  public categoryName!: string;
  public parentCategoryId?: string;
  public description?: string;
  public displayOrder!: number;
  public iconUrl?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MaterialCategory.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    categoryName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    parentCategoryId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'material_categories',
        key: 'id'
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    iconUrl: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'material_categories',
    timestamps: true,
    indexes: [
      {
        fields: ['parentCategoryId']
      },
      {
        fields: ['displayOrder']
      }
    ]
  }
);

// Self-referencing association
MaterialCategory.belongsTo(MaterialCategory, { foreignKey: 'parentCategoryId', as: 'parentCategory' });
MaterialCategory.hasMany(MaterialCategory, { foreignKey: 'parentCategoryId', as: 'subcategories' });

export default MaterialCategory;
