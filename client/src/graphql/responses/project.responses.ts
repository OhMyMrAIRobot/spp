import type { IProjectWithStats } from '../../types/projects/project-with-stats'

export type GetProjectsQueryResponse = {
	projects: IProjectWithStats[]
}

export type GetProjectByIdQueryResponse = {
	project: IProjectWithStats
}

export type CreateProjectMutationResponse = {
	createProject: IProjectWithStats
}

export type UpdateProjectMutationResponse = {
	updateProject: IProjectWithStats
}

export type DeleteProjectMutationResponse = {
	deleteProject: boolean
}
