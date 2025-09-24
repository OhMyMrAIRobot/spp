import { IProject } from './models/project/project';
import { ITask } from './models/task/task';
import { TaskStatusEnum } from './models/task/task-status';

export const mockTasks: ITask[] = [
  // TODO tasks
  {
    id: 't1',
    title: 'Develop Home Page',
    description: 'Create responsive home page with hero section and navigation',
    status: TaskStatusEnum.TODO,
    assignee: 'Anna Petrova',
    createdAt: new Date('2024-01-15').toISOString(),
    dueDate: new Date('2024-02-01').toISOString(),
    projectId: 'p1',
  },
  {
    id: 't2',
    title: 'Integrate Auth API',
    description: 'Connect OAuth2 providers and configure JWT tokens',
    status: TaskStatusEnum.TODO,
    assignee: 'Ivan Sidorov',
    createdAt: new Date('2024-01-16').toISOString(),
    dueDate: new Date('2024-02-05').toISOString(),
    projectId: 'p1',
  },
  {
    id: 't3',
    title: 'Write Component Tests',
    description: 'Achieve at least 80% coverage for all core components',
    status: TaskStatusEnum.TODO,
    assignee: 'Maria Ivanova',
    createdAt: new Date('2024-01-17').toISOString(),
    dueDate: new Date('2024-02-10').toISOString(),
    projectId: 'p2',
  },
  {
    id: 't4',
    title: 'Optimize Webpack Build',
    description: 'Reduce bundle size and improve build time',
    status: TaskStatusEnum.TODO,
    assignee: 'Peter Vasiliev',
    createdAt: new Date('2024-01-18').toISOString(),
    dueDate: new Date('2024-02-15').toISOString(),
    projectId: 'p3',
  },

  // IN_PROGRESS
  {
    id: 't5',
    title: 'Database Refactoring',
    description: 'Add indexes and optimize queries',
    status: TaskStatusEnum.IN_PROGRESS,
    assignee: 'Sergey Kozlov',
    createdAt: new Date('2024-01-10').toISOString(),
    dueDate: new Date('2024-01-25').toISOString(),
    projectId: 'p1',
  },
  {
    id: 't6',
    title: 'Mobile Version Development',
    description: 'Adapt interface for mobile devices',
    status: TaskStatusEnum.IN_PROGRESS,
    assignee: 'Olga Novikova',
    createdAt: new Date('2024-01-12').toISOString(),
    dueDate: new Date('2024-01-30').toISOString(),
    projectId: 'p3',
  },

  // DONE
  {
    id: 't7',
    title: 'CI/CD Pipeline Setup',
    description: 'Automated deployments to staging and production',
    status: TaskStatusEnum.DONE,
    assignee: 'Dmitry Smirnov',
    createdAt: new Date('2024-01-05').toISOString(),
    dueDate: new Date('2024-01-20').toISOString(),
    projectId: 'p2',
  },
  {
    id: 't8',
    title: 'API Documentation',
    description: 'Swagger documentation for all endpoints',
    status: TaskStatusEnum.DONE,
    assignee: 'Ekaterina Volkova',
    createdAt: new Date('2024-01-08').toISOString(),
    dueDate: new Date('2024-01-22').toISOString(),
    projectId: 'p3',
  },
  {
    id: 't9',
    title: 'Design System',
    description: 'Create component library and guidelines',
    status: TaskStatusEnum.DONE,
    assignee: 'Alexey Pavlov',
    createdAt: new Date('2024-01-03').toISOString(),
    dueDate: new Date('2024-01-18').toISOString(),
    projectId: 'p3',
  },
];

export const mockProjects: IProject[] = [
  {
    id: 'p1',
    title: 'Website Redesign',
    createdAt: new Date('2024-09-01').toISOString(),
  },
  {
    id: 'p2',
    title: 'Mobile App Development',
    createdAt: new Date('2024-08-25').toISOString(),
  },
  {
    id: 'p3',
    title: 'Marketing Campaign',
    createdAt: new Date('2024-09-03').toISOString(),
  },
];
