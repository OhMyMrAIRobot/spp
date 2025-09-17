import type { TaskStatusEnum } from './task-status-enum'

/**
 * Represents a task entity in the task management system
 *
 * @interface ITask
 * @description Core domain model for task items with tracking and status management
 */
export interface ITask {
	id: string
	title: string
	description: string
	status: TaskStatusEnum
	createdAt: Date
	dueDate?: Date
}
