import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import User from './User.model';

interface ProjectAttributes {
  id: string;
  ownerId: string;
  projectName: string;
  projectType: 'new_construction' | 'renovation' | 'addition' | 'remodel';
  address?: string;
  lotSizeSqft?: number;
  budgetMin?: number;
  budgetMax?: number;
  status: 'design' | 'planning' | 'permitting' | 'construction' | 'completed' | 'on_hold';
  startDate?: Date;
  estimatedCompletionDate?: Date;
  actualCompletionDate?: Date;
  description?: string;
  thumbnailUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProjectCreationAttributes extends Optional<ProjectAttributes, 'id' | 'status'> {}

class Project extends Model<ProjectAttributes, ProjectCreationAttributes> implements ProjectAttributes {
  public id!: string;
  public ownerId!: string;
  public projectName!: string;
  public projectType!: 'new_construction' | 'renovation' | 'addition' | 'remodel';
  public address?: string;
  public lotSizeSqft?: number;
  public budgetMin?: number;
  public budgetMax?: number;
  public status!: 'design' | 'planning' | 'permitting' | 'construction' | 'completed' | 'on_hold';
  public startDate?: Date;
  public estimatedCompletionDate?: Date;
  public actualCompletionDate?: Date;
  public description?: string;
  public thumbnailUrl?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Project.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    projectName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    projectType: {
      type: DataTypes.ENUM('new_construction', 'renovation', 'addition', 'remodel'),
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    lotSizeSqft: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    budgetMin: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true
    },
    budgetMax: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('design', 'planning', 'permitting', 'construction', 'completed', 'on_hold'),
      defaultValue: 'design'
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    estimatedCompletionDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    actualCompletionDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    thumbnailUrl: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'projects',
    timestamps: true,
    indexes: [
      {
        fields: ['ownerId']
      },
      {
        fields: ['status']
      }
    ]
  }
);

// Associations
Project.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });
User.hasMany(Project, { foreignKey: 'ownerId', as: 'projects' });

export default Project;
