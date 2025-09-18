/**
 * Enumeration of possible task status values
 *
 * @constant {Object} TaskStatusEnum
 * @description Defines all valid states a task can be in during its lifecycle
 */
export const TaskStatusEnum = {
	TODO: 'TODO',
	IN_PROGRESS: 'IN_PROGRESS',
	DONE: 'DONE',
} as const

export type TaskStatusEnum = keyof typeof TaskStatusEnum
