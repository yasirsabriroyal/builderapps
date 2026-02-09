import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import Design from './Design.model';

interface FloorPlanAttributes {
  id: string;
  designId: string;
  floorNumber: number;
  floorName?: string;
  floorData: any; // JSON structure with walls, doors, windows, rooms
  thumbnailUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface FloorPlanCreationAttributes extends Optional<FloorPlanAttributes, 'id'> {}

class FloorPlan extends Model<FloorPlanAttributes, FloorPlanCreationAttributes> implements FloorPlanAttributes {
  public id!: string;
  public designId!: string;
  public floorNumber!: number;
  public floorName?: string;
  public floorData!: any;
  public thumbnailUrl?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

FloorPlan.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    designId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'designs',
        key: 'id'
      }
    },
    floorNumber: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    floorName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    floorData: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
        walls: [],
        doors: [],
        windows: [],
        rooms: [],
        dimensions: { width: 0, length: 0 }
      }
    },
    thumbnailUrl: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'floor_plans',
    timestamps: true,
    indexes: [
      {
        fields: ['designId']
      },
      {
        unique: true,
        fields: ['designId', 'floorNumber']
      }
    ]
  }
);

// Associations
FloorPlan.belongsTo(Design, { foreignKey: 'designId', as: 'design' });
Design.hasMany(FloorPlan, { foreignKey: 'designId', as: 'floorPlans' });

export default FloorPlan;
