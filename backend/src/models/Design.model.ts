import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import Project from './Project.model';
import User from './User.model';

interface DesignAttributes {
  id: string;
  projectId: string;
  versionNumber: number;
  designName: string;
  description?: string;
  isActive: boolean;
  isApproved: boolean;
  approvedBy?: string;
  approvedAt?: Date;
  totalSqft?: number;
  numBedrooms?: number;
  numBathrooms?: number;
  numStories?: number;
  style?: string;
  thumbnailUrl?: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface DesignCreationAttributes extends Optional<DesignAttributes, 'id' | 'versionNumber' | 'isActive' | 'isApproved'> {}

class Design extends Model<DesignAttributes, DesignCreationAttributes> implements DesignAttributes {
  public id!: string;
  public projectId!: string;
  public versionNumber!: number;
  public designName!: string;
  public description?: string;
  public isActive!: boolean;
  public isApproved!: boolean;
  public approvedBy?: string;
  public approvedAt?: Date;
  public totalSqft?: number;
  public numBedrooms?: number;
  public numBathrooms?: number;
  public numStories?: number;
  public style?: string;
  public thumbnailUrl?: string;
  public createdBy?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Design.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'projects',
        key: 'id'
      }
    },
    versionNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    designName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    approvedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    totalSqft: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    numBedrooms: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    numBathrooms: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: true
    },
    numStories: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    style: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    thumbnailUrl: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    tableName: 'designs',
    timestamps: true,
    indexes: [
      {
        fields: ['projectId']
      },
      {
        fields: ['isActive']
      },
      {
        unique: true,
        fields: ['projectId', 'versionNumber']
      }
    ]
  }
);

// Associations
Design.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
Design.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
Design.belongsTo(User, { foreignKey: 'approvedBy', as: 'approver' });
Project.hasMany(Design, { foreignKey: 'projectId', as: 'designs' });

export default Design;
