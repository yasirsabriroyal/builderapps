import { Project, Task, Milestone } from '../models';

interface ProjectWithAssociations extends Project {
  tasks?: Task[];
  milestones?: Milestone[];
}

export const calculateProjectProgress = async (projectId: number): Promise<number> => {
  const project = await Project.findByPk(projectId, {
    include: [{ association: 'tasks' }, { association: 'milestones' }]
  }) as ProjectWithAssociations | null;

  if (!project) {
    return 0;
  }

  const tasks = project.tasks || [];
  const milestones = project.milestones || [];

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t: Task) => t.status === 'completed').length;

  const totalMilestones = milestones.length;
  const completedMilestones = milestones.filter((m: Milestone) => m.status === 'completed').length;

  if (totalTasks === 0 && totalMilestones === 0) {
    return 0;
  }

  const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 50 : 0;
  const milestoneProgress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 50 : 0;

  return Math.round(taskProgress + milestoneProgress);
};

export const calculateBudgetUtilization = (totalBudget: number, actualCost: number): number => {
  if (totalBudget === 0) return 0;
  return Math.round((actualCost / totalBudget) * 100);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};
