import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export interface BudgetAttributes {
  id?: number;
  projectId: number;
  totalBudget: number;
  actualCost: number;
}

class Budget extends Model<BudgetAttributes> implements BudgetAttributes {
  public id!: number;
  public projectId!: number;
  public totalBudget!: number;
  public actualCost!: number;
}

Budget.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'projects',
        key: 'id'
      }
    },
    totalBudget: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    actualCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    sequelize,
    tableName: 'budgets',
    timestamps: false
  }
);

export default Budget;
