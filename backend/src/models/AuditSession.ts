import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export type AuditStatus = 'in-progress' | 'completed';

export interface AuditSessionAttributes {
  id?: number;
  workspaceId: number;
  name: string;
  status: AuditStatus;
  startedBy: number;
  startedAt: Date;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

class AuditSession extends Model<AuditSessionAttributes> implements AuditSessionAttributes {
  public id!: number;
  public workspaceId!: number;
  public name!: string;
  public status!: AuditStatus;
  public startedBy!: number;
  public startedAt!: Date;
  public completedAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AuditSession.init(
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
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('in-progress', 'completed'),
      allowNull: false,
      defaultValue: 'in-progress'
    },
    startedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    startedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'audit_sessions',
    timestamps: true,
    indexes: [{ fields: ['workspaceId', 'status'] }]
  }
);

export default AuditSession;
