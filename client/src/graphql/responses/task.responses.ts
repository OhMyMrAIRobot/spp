import type { ITaskExtended } from '../../types/tasks/task-extended'

export type GetTasksByProjectQueryResponse = {
	tasksByProject: ITaskExtended[]
}

export type CreateTaskMutationResponse = {
	createTask: ITaskExtended
}

export type UpdateTaskMutationResponse = {
	updateTask: ITaskExtended
}

export type DeleteTaskMutationResponse = {
	deleteTask: boolean
}
