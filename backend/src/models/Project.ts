import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export interface ProjectAttributes {
  id?: number;
  userId: number;
  name: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  designData?: object;
  budget?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class Project extends Model<ProjectAttributes> implements ProjectAttributes {
  public id!: number;
  public userId!: number;
  public name!: string;
  public status!: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  public designData?: object;
  public budget?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Project.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('planning', 'in-progress', 'completed', 'on-hold'),
      allowNull: false,
      defaultValue: 'planning'
    },
    designData: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    budget: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'projects',
    timestamps: true
  }
);

export default Project;
