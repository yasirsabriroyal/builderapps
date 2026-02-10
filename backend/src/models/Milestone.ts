import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export interface MilestoneAttributes {
  id?: number;
  projectId: number;
  name: string;
  description?: string;
  dueDate?: Date;
  completedDate?: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'delayed';
}

class Milestone extends Model<MilestoneAttributes> implements MilestoneAttributes {
  public id!: number;
  public projectId!: number;
  public name!: string;
  public description?: string;
  public dueDate?: Date;
  public completedDate?: Date;
  public status!: 'pending' | 'in-progress' | 'completed' | 'delayed';
}

Milestone.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'projects',
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
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    completedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'in-progress', 'completed', 'delayed'),
      allowNull: false,
      defaultValue: 'pending'
    }
  },
  {
    sequelize,
    tableName: 'milestones',
    timestamps: false
  }
);

export default Milestone;
