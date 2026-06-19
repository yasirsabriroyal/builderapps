import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export type WorkspacePlan = 'starter' | 'growth' | 'enterprise';

export interface WorkspaceAttributes {
  id?: number;
  name: string;
  slug: string;
  ownerUserId: number;
  plan: WorkspacePlan;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

class Workspace extends Model<WorkspaceAttributes> implements WorkspaceAttributes {
  public id!: number;
  public name!: string;
  public slug!: string;
  public ownerUserId!: number;
  public plan!: WorkspacePlan;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Workspace.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    ownerUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    plan: {
      type: DataTypes.ENUM('starter', 'growth', 'enterprise'),
      allowNull: false,
      defaultValue: 'starter'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    sequelize,
    tableName: 'workspaces',
    timestamps: true
  }
);

export default Workspace;
