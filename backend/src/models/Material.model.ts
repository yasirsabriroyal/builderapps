import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import MaterialCategory from './MaterialCategory.model';

interface MaterialAttributes {
  id: string;
  categoryId: string;
  materialName: string;
  manufacturer?: string;
  modelNumber?: string;
  description?: string;
  pricePerUnit: number;
  unitType: string;
  color?: string;
  finish?: string;
  imageUrls?: string[];
  thumbnailUrl?: string;
  specifications?: any;
  sustainabilityRating?: string;
  leadTimeDays?: number;
  vendorInfo?: any;
  isAvailable: boolean;
  isPremium: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface MaterialCreationAttributes extends Optional<MaterialAttributes, 'id' | 'isAvailable' | 'isPremium'> {}

class Material extends Model<MaterialAttributes, MaterialCreationAttributes> implements MaterialAttributes {
  public id!: string;
  public categoryId!: string;
  public materialName!: string;
  public manufacturer?: string;
  public modelNumber?: string;
  public description?: string;
  public pricePerUnit!: number;
  public unitType!: string;
  public color?: string;
  public finish?: string;
  public imageUrls?: string[];
  public thumbnailUrl?: string;
  public specifications?: any;
  public sustainabilityRating?: string;
  public leadTimeDays?: number;
  public vendorInfo?: any;
  public isAvailable!: boolean;
  public isPremium!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Material.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'material_categories',
        key: 'id'
      }
    },
    materialName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    manufacturer: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    modelNumber: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    pricePerUnit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    unitType: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    color: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    finish: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    imageUrls: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: []
    },
    thumbnailUrl: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    specifications: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    sustainabilityRating: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    leadTimeDays: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    vendorInfo: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isPremium: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    sequelize,
    tableName: 'materials',
    timestamps: true,
    indexes: [
      {
        fields: ['categoryId']
      },
      {
        fields: ['isAvailable']
      },
      {
        fields: ['materialName']
      },
      {
        fields: ['pricePerUnit']
      }
    ]
  }
);

// Associations
Material.belongsTo(MaterialCategory, { foreignKey: 'categoryId', as: 'category' });
MaterialCategory.hasMany(Material, { foreignKey: 'categoryId', as: 'materials' });

export default Material;
