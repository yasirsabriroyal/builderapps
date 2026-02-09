import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export interface TaskAttributes {
  id?: number;
  projectId: number;
  title: string;
  description?: string;
  assignedTo?: number;
  dueDate?: Date;
  status: 'todo' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

class Task extends Model<TaskAttributes> implements TaskAttributes {
  public id!: number;
  public projectId!: number;
  public title!: string;
  public description?: string;
  public assignedTo?: number;
  public dueDate?: Date;
  public status!: 'todo' | 'in-progress' | 'completed' | 'cancelled';
  public priority!: 'low' | 'medium' | 'high' | 'urgent';
}

Task.init(
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
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    assignedTo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('todo', 'in-progress', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'todo'
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      allowNull: false,
      defaultValue: 'medium'
    }
  },
  {
    sequelize,
    tableName: 'tasks',
    timestamps: false
  }
);

export default Task;
