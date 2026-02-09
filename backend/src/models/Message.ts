import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export interface MessageAttributes {
  id?: number;
  projectId: number;
  userId: number;
  content: string;
  createdAt?: Date;
}

class Message extends Model<MessageAttributes> implements MessageAttributes {
  public id!: number;
  public projectId!: number;
  public userId!: number;
  public content!: string;
  public readonly createdAt!: Date;
}

Message.init(
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'messages',
    timestamps: true,
    updatedAt: false
  }
);

export default Message;
