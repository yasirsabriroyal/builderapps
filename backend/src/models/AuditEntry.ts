import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export interface AuditEntryAttributes {
  id?: number;
  auditSessionId: number;
  itemId: number;
  recordedBy: number;
  expectedQuantity: number;
  countedQuantity: number;
  discrepancy: number;
  notes?: string;
  evidenceImageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class AuditEntry extends Model<AuditEntryAttributes> implements AuditEntryAttributes {
  public id!: number;
  public auditSessionId!: number;
  public itemId!: number;
  public recordedBy!: number;
  public expectedQuantity!: number;
  public countedQuantity!: number;
  public discrepancy!: number;
  public notes?: string;
  public evidenceImageUrl?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AuditEntry.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    auditSessionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'audit_sessions',
        key: 'id'
      }
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'inventory_items',
        key: 'id'
      }
    },
    recordedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    expectedQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    countedQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    discrepancy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    evidenceImageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'audit_entries',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['auditSessionId', 'itemId']
      }
    ]
  }
);

export default AuditEntry;
