import type { TaskStatusEnum } from '../../types/tasks/task-status-enum'
import { TaskStatus } from '../generated/common'

export const taskStatusToGrpc = (status?: TaskStatusEnum): TaskStatus => {
	switch (status) {
		case 'TODO':
			return TaskStatus.TODO
		case 'IN_PROGRESS':
			return TaskStatus.IN_PROGRESS
		case 'DONE':
			return TaskStatus.DONE
		default:
			return TaskStatus.TASK_STATUS_UNSPECIFIED
	}
}

export const taskStatusFromGrpc = (status?: TaskStatus): TaskStatusEnum => {
	switch (status) {
		case TaskStatus.TODO:
			return 'TODO'
		case TaskStatus.IN_PROGRESS:
			return 'IN_PROGRESS'
		case TaskStatus.DONE:
			return 'DONE'
		default:
			return 'TODO'
	}
}
