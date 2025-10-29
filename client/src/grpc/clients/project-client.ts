import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport'
import type { CreateProjectData } from '../../types/projects/create-project-data'
import { API_URL } from '../../utils/constants'
import {
	CreateProjectRequest,
	DeleteProjectRequest,
	GetAllProjectsRequest,
	GetProjectByIdRequest,
	UpdateProjectRequest,
} from '../generated/project'
import { ProjectServiceClient } from '../generated/project.client'
import { callWithAuth } from './grpc-client-wrapper'

const transport = new GrpcWebFetchTransport({
	baseUrl: API_URL,
})

export const projectClient = new ProjectServiceClient(transport)

export async function grpcGetAllProjects() {
	const request = GetAllProjectsRequest.create()
	return callWithAuth(projectClient.getAll, request, projectClient)
}

export async function grpcGetProjectById(id: string) {
	const request = GetProjectByIdRequest.create({ id })
	return callWithAuth(projectClient.getById, request, projectClient)
}

export async function grpcCreateProject(data: CreateProjectData) {
	const request = CreateProjectRequest.create({ ...data })
	return callWithAuth(projectClient.create, request, projectClient)
}

export async function grpcUpdateProject(
	id: string,
	data: Partial<CreateProjectData>
) {
	const request = UpdateProjectRequest.create({ id, ...data })
	return callWithAuth(projectClient.update, request, projectClient)
}

export async function grpcDeleteProject(id: string) {
	const request = DeleteProjectRequest.create({ id })
	return callWithAuth(projectClient.delete, request, projectClient)
}
