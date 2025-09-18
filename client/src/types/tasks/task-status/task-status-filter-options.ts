import { TaskStatusEnum } from './task-status-enum'

/**
 * Task status filter type including 'All' option for UI filtering
 */
export const TaskStatusFilterOptions = {
	ALL: 'ALL',
	...TaskStatusEnum,
} as const

export type TaskStatusFilterOptions = keyof typeof TaskStatusFilterOptions
