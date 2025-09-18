import type { ITask } from '../tasks/task'

/**
 * Represents a project entity in the project management system
 *
 * @interface IProject
 * @description Core domain model for project containers with task aggregation and metadata
 */
export interface IProject {
	id: string
	title: string
	tasks: ITask[]
	createdAt: Date
}
