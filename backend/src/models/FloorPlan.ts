import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export interface FloorPlanAttributes {
  id?: number;
  projectId: number;
  name: string;
  canvasData?: object;
  createdAt?: Date;
}

class FloorPlan extends Model<FloorPlanAttributes> implements FloorPlanAttributes {
  public id!: number;
  public projectId!: number;
  public name!: string;
  public canvasData?: object;
  public readonly createdAt!: Date;
}

FloorPlan.init(
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
    canvasData: {
      type: DataTypes.JSONB,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'floor_plans',
    timestamps: true,
    updatedAt: false
  }
);

export default FloorPlan;
