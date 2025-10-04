import type { ITaskExtended } from '../types/tasks/task-extended'
import type { TaskStatusEnum } from '../types/tasks/task-status-enum'

export const getTasksByStatus = (
	tasks: ITaskExtended[],
	status: TaskStatusEnum
): ITaskExtended[] => {
	return tasks.filter(t => t.status === status)
}
