import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export interface GalleryAttributes {
  id?: number;
  projectId: number;
  imageUrl: string;
  title?: string;
  description?: string;
}

class Gallery extends Model<GalleryAttributes> implements GalleryAttributes {
  public id!: number;
  public projectId!: number;
  public imageUrl!: string;
  public title?: string;
  public description?: string;
}

Gallery.init(
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
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'gallery',
    timestamps: false
  }
);

export default Gallery;
