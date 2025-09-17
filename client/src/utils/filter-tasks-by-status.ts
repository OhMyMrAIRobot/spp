import type { ITask } from '../types/tasks/task'
import type { TaskStatusEnum } from '../types/tasks/task-status-enum'

export const filterTasksByStatus = (
	tasks: ITask[],
	status: TaskStatusEnum
): ITask[] => {
	return tasks.filter(t => t.status === status)
}
