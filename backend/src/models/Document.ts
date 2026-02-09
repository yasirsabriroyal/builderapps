import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export interface DocumentAttributes {
  id?: number;
  projectId: number;
  name: string;
  fileUrl: string;
  category?: string;
  uploadedBy: number;
  createdAt?: Date;
}

class Document extends Model<DocumentAttributes> implements DocumentAttributes {
  public id!: number;
  public projectId!: number;
  public name!: string;
  public fileUrl!: string;
  public category?: string;
  public uploadedBy!: number;
  public readonly createdAt!: Date;
}

Document.init(
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
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true
    },
    uploadedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    tableName: 'documents',
    timestamps: true,
    updatedAt: false
  }
);

export default Document;
