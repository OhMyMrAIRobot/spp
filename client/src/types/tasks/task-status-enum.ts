/**
 * Enumeration of possible task status values
 *
 * @constant {Object} TaskStatusEnum
 * @description Defines all valid states a task can be in during its lifecycle
 */
const TaskStatusEnum = {
	TODO: 'todo',
	IN_PROGRESS: 'in_progress',
	DONE: 'done',
} as const

export type TaskStatusEnum = keyof typeof TaskStatusEnum
