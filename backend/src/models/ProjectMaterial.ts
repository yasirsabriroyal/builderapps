import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export interface ProjectMaterialAttributes {
  id?: number;
  projectId: number;
  materialId: number;
  quantity: number;
  room?: string;
}

class ProjectMaterial extends Model<ProjectMaterialAttributes> implements ProjectMaterialAttributes {
  public id!: number;
  public projectId!: number;
  public materialId!: number;
  public quantity!: number;
  public room?: string;
}

ProjectMaterial.init(
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
    materialId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'materials',
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    room: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'project_materials',
    timestamps: false
  }
);

export default ProjectMaterial;
