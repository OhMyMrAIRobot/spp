import type { IProject } from './types/projects/project'
import type { ITask } from './types/tasks/task'
import { TaskStatusEnum } from './types/tasks/task-status/task-status-enum'
import { generateId } from './utils/generate-id'

export const mockTasks: ITask[] = [
	// TODO tasks (4)
	{
		id: generateId(),
		title: 'Develop Home Page',
		description: 'Create responsive home page with hero section and navigation',
		status: TaskStatusEnum.TODO,
		assignee: 'Anna Petrova',
		createdAt: new Date('2024-01-15'),
		dueDate: new Date('2024-02-01'),
	},
	{
		id: generateId(),
		title: 'Integrate Auth API',
		description: 'Connect OAuth2 providers and configure JWT tokens',
		status: TaskStatusEnum.TODO,
		assignee: 'Ivan Sidorov',
		createdAt: new Date('2024-01-16'),
		dueDate: new Date('2024-02-05'),
	},
	{
		id: generateId(),
		title: 'Write Component Tests',
		description: 'Achieve at least 80% coverage for all core components',
		status: TaskStatusEnum.TODO,
		assignee: 'Maria Ivanova',
		createdAt: new Date('2024-01-17'),
		dueDate: new Date('2024-02-10'),
	},
	{
		id: generateId(),
		title: 'Optimize Webpack Build',
		description: 'Reduce bundle size and improve build time',
		status: TaskStatusEnum.TODO,
		assignee: 'Peter Vasiliev',
		createdAt: new Date('2024-01-18'),
		dueDate: new Date('2024-02-15'),
	},

	// IN_PROGRESS tasks (2)
	{
		id: generateId(),
		title: 'Database Refactoring',
		description: 'Add indexes and optimize queries',
		status: TaskStatusEnum.IN_PROGRESS,
		assignee: 'Sergey Kozlov',
		createdAt: new Date('2024-01-10'),
		dueDate: new Date('2024-01-25'),
	},
	{
		id: generateId(),
		title: 'Mobile Version Development',
		description: 'Adapt interface for mobile devices',
		status: TaskStatusEnum.IN_PROGRESS,
		assignee: 'Olga Novikova',
		createdAt: new Date('2024-01-12'),
		dueDate: new Date('2024-01-30'),
	},

	// DONE tasks (3)
	{
		id: generateId(),
		title: 'CI/CD Pipeline Setup',
		description: 'Automated deployments to staging and production',
		status: TaskStatusEnum.DONE,
		assignee: 'Dmitry Smirnov',
		createdAt: new Date('2024-01-05'),
		dueDate: new Date('2024-01-20'),
	},
	{
		id: generateId(),
		title: 'API Documentation',
		description: 'Swagger documentation for all endpoints',
		status: TaskStatusEnum.DONE,
		assignee: 'Ekaterina Volkova',
		createdAt: new Date('2024-01-08'),
		dueDate: new Date('2024-01-22'),
	},
	{
		id: generateId(),
		title: 'Design System',
		description: 'Create component library and guidelines',
		status: TaskStatusEnum.DONE,
		assignee: 'Alexey Pavlov',
		createdAt: new Date('2024-01-03'),
		dueDate: new Date('2024-01-18'),
	},
]

export const mockProjects: IProject[] = [
	{
		id: generateId(),
		title: 'Website Redesign',
		tasks: [
			{
				id: generateId(),
				title: 'Create wireframes',
				description: 'Design initial wireframes for homepage and product pages',
				assignee: 'Alice Johnson',
				dueDate: new Date('2024-12-15'),
				status: TaskStatusEnum.IN_PROGRESS,
				createdAt: new Date('2024-09-01'),
			},
			{
				id: generateId(),
				title: 'Develop responsive layout',
				description: 'Implement mobile-first responsive design',
				assignee: 'Bob Smith',
				dueDate: new Date('2024-12-20'),
				status: TaskStatusEnum.TODO,
				createdAt: new Date('2024-09-05'),
			},
		],
		createdAt: new Date('2024-09-01'),
	},
	{
		id: generateId(),
		title: 'Mobile App Development',
		tasks: [
			{
				id: generateId(),
				title: 'Setup development environment',
				description: 'Configure React Native and dependencies',
				assignee: 'Charlie Brown',
				dueDate: new Date('2024-12-10'),
				status: TaskStatusEnum.DONE,
				createdAt: new Date('2024-08-25'),
			},
			{
				id: generateId(),
				title: 'Design UI components',
				description: 'Create reusable UI component library',
				assignee: 'Diana Prince',
				dueDate: new Date('2024-12-18'),
				status: TaskStatusEnum.IN_PROGRESS,
				createdAt: new Date('2024-08-28'),
			},
		],
		createdAt: new Date('2024-08-25'),
	},
	{
		id: generateId(),
		title: 'Marketing Campaign',
		tasks: [
			{
				id: generateId(),
				title: 'Create campaign strategy',
				description: 'Develop comprehensive marketing plan',
				assignee: 'Ethan Hunt',
				dueDate: new Date('2024-12-05'),
				status: TaskStatusEnum.TODO,
				createdAt: new Date('2024-09-03'),
			},
			{
				id: generateId(),
				title: 'Design promotional materials',
				description: 'Create banners, social media graphics, and ads',
				assignee: 'Fiona Gallagher',
				dueDate: new Date('2024-12-12'),
				status: TaskStatusEnum.TODO,
				createdAt: new Date('2024-09-04'),
			},
		],
		createdAt: new Date('2024-09-03'),
	},
]
