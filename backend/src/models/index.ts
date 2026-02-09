import sequelize from '../config/database';
import User from './User';
import Project from './Project';
import FloorPlan from './FloorPlan';
import MaterialCategory from './MaterialCategory';
import Material from './Material';
import ProjectMaterial from './ProjectMaterial';
import Budget from './Budget';
import BudgetLineItem from './BudgetLineItem';
import Milestone from './Milestone';
import Document from './Document';
import Message from './Message';
import Task from './Task';
import Notification from './Notification';
import Gallery from './Gallery';

User.hasMany(Project, { foreignKey: 'userId', as: 'projects' });
Project.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Project.hasMany(FloorPlan, { foreignKey: 'projectId', as: 'floorPlans' });
FloorPlan.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

MaterialCategory.hasMany(Material, { foreignKey: 'categoryId', as: 'materials' });
Material.belongsTo(MaterialCategory, { foreignKey: 'categoryId', as: 'category' });

Project.belongsToMany(Material, { through: ProjectMaterial, foreignKey: 'projectId', as: 'materials' });
Material.belongsToMany(Project, { through: ProjectMaterial, foreignKey: 'materialId', as: 'projects' });

Project.hasOne(Budget, { foreignKey: 'projectId', as: 'budget' });
Budget.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

Budget.hasMany(BudgetLineItem, { foreignKey: 'budgetId', as: 'lineItems' });
BudgetLineItem.belongsTo(Budget, { foreignKey: 'budgetId', as: 'budget' });

Project.hasMany(Milestone, { foreignKey: 'projectId', as: 'milestones' });
Milestone.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

Project.hasMany(Document, { foreignKey: 'projectId', as: 'documents' });
Document.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

User.hasMany(Document, { foreignKey: 'uploadedBy', as: 'uploadedDocuments' });
Document.belongsTo(User, { foreignKey: 'uploadedBy', as: 'uploader' });

Project.hasMany(Message, { foreignKey: 'projectId', as: 'messages' });
Message.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

User.hasMany(Message, { foreignKey: 'userId', as: 'messages' });
Message.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Project.hasMany(Task, { foreignKey: 'projectId', as: 'tasks' });
Task.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

User.hasMany(Task, { foreignKey: 'assignedTo', as: 'assignedTasks' });
Task.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignee' });

User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Project.hasMany(Gallery, { foreignKey: 'projectId', as: 'gallery' });
Gallery.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

export {
  sequelize,
  User,
  Project,
  FloorPlan,
  MaterialCategory,
  Material,
  ProjectMaterial,
  Budget,
  BudgetLineItem,
  Milestone,
  Document,
  Message,
  Task,
  Notification,
  Gallery
};
