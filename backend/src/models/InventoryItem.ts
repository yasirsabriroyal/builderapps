import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export type InventoryCondition = 'new' | 'good' | 'fair' | 'damaged';
export type InventoryStatus = 'available' | 'in-use' | 'missing' | 'repair';

export interface InventoryItemAttributes {
  id?: number;
  workspaceId: number;
  createdBy: number;
  itemCode: string;
  name: string;
  category: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  quantity: number;
  unit: string;
  condition: InventoryCondition;
  status: InventoryStatus;
  location?: string;
  assignedTo?: string;
  description?: string;
  imageUrl?: string;
  aiConfidence?: number;
  lastAuditAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

class InventoryItem extends Model<InventoryItemAttributes> implements InventoryItemAttributes {
  public id!: number;
  public workspaceId!: number;
  public createdBy!: number;
  public itemCode!: string;
  public name!: string;
  public category!: string;
  public brand?: string;
  public model?: string;
  public serialNumber?: string;
  public quantity!: number;
  public unit!: string;
  public condition!: InventoryCondition;
  public status!: InventoryStatus;
  public location?: string;
  public assignedTo?: string;
  public description?: string;
  public imageUrl?: string;
  public aiConfidence?: number;
  public lastAuditAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

InventoryItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    workspaceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'workspaces',
        key: 'id'
      }
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    itemCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: true
    },
    model: {
      type: DataTypes.STRING,
      allowNull: true
    },
    serialNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 0
      }
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pcs'
    },
    condition: {
      type: DataTypes.ENUM('new', 'good', 'fair', 'damaged'),
      allowNull: false,
      defaultValue: 'good'
    },
    status: {
      type: DataTypes.ENUM('available', 'in-use', 'missing', 'repair'),
      allowNull: false,
      defaultValue: 'available'
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    assignedTo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    aiConfidence: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    lastAuditAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'inventory_items',
    timestamps: true,
    indexes: [
      {
        fields: ['workspaceId']
      },
      {
        fields: ['workspaceId', 'category']
      }
    ]
  }
);

export default InventoryItem;
