import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export interface BudgetLineItemAttributes {
  id?: number;
  budgetId: number;
  category: string;
  description: string;
  estimatedCost: number;
  actualCost: number;
}

class BudgetLineItem extends Model<BudgetLineItemAttributes> implements BudgetLineItemAttributes {
  public id!: number;
  public budgetId!: number;
  public category!: string;
  public description!: string;
  public estimatedCost!: number;
  public actualCost!: number;
}

BudgetLineItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    budgetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'budgets',
        key: 'id'
      }
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    estimatedCost: {
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
    tableName: 'budget_line_items',
    timestamps: false
  }
);

export default BudgetLineItem;
