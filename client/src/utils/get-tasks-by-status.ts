import type { TaskStatusEnum } from '../types/tasks/task-status-enum'
import type { ITaskWithUser } from '../types/tasks/task-with-user'

export const getTasksByStatus = (
	tasks: ITaskWithUser[],
	status: TaskStatusEnum
): ITaskWithUser[] => {
	return tasks.filter(t => t.status === status)
}
