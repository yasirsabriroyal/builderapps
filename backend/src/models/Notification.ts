import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export interface NotificationAttributes {
  id?: number;
  userId: number;
  type: string;
  message: string;
  read: boolean;
  createdAt?: Date;
}

class Notification extends Model<NotificationAttributes> implements NotificationAttributes {
  public id!: number;
  public userId!: number;
  public type!: string;
  public message!: string;
  public read!: boolean;
  public readonly createdAt!: Date;
}

Notification.init(
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
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    sequelize,
    tableName: 'notifications',
    timestamps: true,
    updatedAt: false
  }
);

export default Notification;
