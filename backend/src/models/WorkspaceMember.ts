import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export type WorkspaceRole = 'owner' | 'admin' | 'auditor' | 'member';

export interface WorkspaceMemberAttributes {
  id?: number;
  workspaceId: number;
  userId: number;
  role: WorkspaceRole;
  createdAt?: Date;
  updatedAt?: Date;
}

class WorkspaceMember extends Model<WorkspaceMemberAttributes> implements WorkspaceMemberAttributes {
  public id!: number;
  public workspaceId!: number;
  public userId!: number;
  public role!: WorkspaceRole;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

WorkspaceMember.init(
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    role: {
      type: DataTypes.ENUM('owner', 'admin', 'auditor', 'member'),
      allowNull: false,
      defaultValue: 'member'
    }
  },
  {
    sequelize,
    tableName: 'workspace_members',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['workspaceId', 'userId']
      }
    ]
  }
);

export default WorkspaceMember;
