import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport'
import type { CreateTaskData } from '../../types/tasks/create-task-data'
import { API_URL } from '../../utils/constants'
import {
	CreateTaskRequest,
	DeleteTaskRequest,
	GetTasksByProjectRequest,
	UpdateTaskRequest,
} from '../generated/task'
import { TaskServiceClient } from '../generated/task.client'
import { taskStatusToGrpc } from '../mappers/task.mapper'
import { callWithAuth } from './grpc-client-wrapper'

const transport = new GrpcWebFetchTransport({
	baseUrl: API_URL,
})

export const taskClient = new TaskServiceClient(transport)

export async function grpcGetTasksByProject(projectId: string) {
	const request = GetTasksByProjectRequest.create({ projectId })
	return callWithAuth(taskClient.getByProject, request, taskClient)
}

export async function grpcCreateTask(data: CreateTaskData) {
	const request = CreateTaskRequest.create({
		...data,
		status: taskStatusToGrpc(data.status),
	})
	return callWithAuth(taskClient.create, request, taskClient)
}

export async function grpcUpdateTask(
	id: string,
	data: Partial<CreateTaskData>
) {
	const request = UpdateTaskRequest.create({
		id,
		...data,
		status: data.status ? taskStatusToGrpc(data.status) : undefined,
	})
	return callWithAuth(taskClient.update, request, taskClient)
}

export async function grpcDeleteTask(id: string) {
	const request = DeleteTaskRequest.create({ id })
	return callWithAuth(taskClient.delete, request, taskClient)
}
