import { useMutation, useQuery } from '@apollo/client/react'
import type { CreateProjectData } from '../../types/projects/create-project-data'
import { apolloClient } from '../apollo-client'
import {
	CREATE_PROJECT_MUTATION,
	DELETE_PROJECT_MUTATION,
	GET_PROJECTS_QUERY,
	GET_PROJECT_BY_ID_QUERY,
	UPDATE_PROJECT_MUTATION,
} from '../queries/project.queries'
import type {
	CreateProjectMutationResponse,
	DeleteProjectMutationResponse,
	GetProjectByIdQueryResponse,
	GetProjectsQueryResponse,
	UpdateProjectMutationResponse,
} from '../responses/project.responses'

// ==================== GET PROJECTS ====================
export const useGetProjects = () => {
	const { data, loading, error, refetch } = useQuery<GetProjectsQueryResponse>(
		GET_PROJECTS_QUERY,
		{
			fetchPolicy: 'cache-first',
			nextFetchPolicy: 'cache-first',
		}
	)

	return {
		projects: data?.projects || [],
		loading,
		error,
		refetch,
	}
}

// ==================== GET PROJECT BY ID ====================
export const useGetProjectById = (id: string) => {
	const { data, loading, error, refetch } =
		useQuery<GetProjectByIdQueryResponse>(GET_PROJECT_BY_ID_QUERY, {
			variables: { id },
			skip: !id,
			fetchPolicy: 'cache-first',
			nextFetchPolicy: 'cache-first',
		})

	return {
		project: data?.project,
		loading,
		error,
		refetch,
	}
}

// ==================== CREATE PROJECT ====================
export const useCreateProject = () => {
	const [createProjectMutation, { loading, error }] = useMutation<
		CreateProjectMutationResponse,
		{ input: CreateProjectData }
	>(CREATE_PROJECT_MUTATION, {
		optimisticResponse: ({ input }) => ({
			__typename: 'Mutation',
			createProject: {
				__typename: 'Project',
				id: `temp-${Date.now()}`,
				title: input.title,
				description: input.description,
				members: [],
				createdAt: new Date().toISOString(),
				taskCounts: {
					__typename: 'TaskCounts',
					TODO: 0,
					IN_PROGRESS: 0,
					DONE: 0,
				},
			},
		}),
		update(cache, { data }) {
			if (!data?.createProject) return

			const existing = cache.readQuery<GetProjectsQueryResponse>({
				query: GET_PROJECTS_QUERY,
			})

			if (existing) {
				cache.writeQuery<GetProjectsQueryResponse>({
					query: GET_PROJECTS_QUERY,
					data: {
						projects: [...existing.projects, data.createProject],
					},
				})
			}
		},
	})

	const createProject = async (input: CreateProjectData) => {
		const result = await createProjectMutation({ variables: { input } })
		return result.data?.createProject || null
	}

	return {
		createProject,
		loading,
		error,
	}
}

// ==================== UPDATE PROJECT ====================
export const useUpdateProject = () => {
	const [updateProjectMutation, { loading, error }] = useMutation<
		UpdateProjectMutationResponse,
		{ id: string; input: Partial<CreateProjectData> }
	>(UPDATE_PROJECT_MUTATION, {
		optimisticResponse: ({ id, input }) => {
			const existing = apolloClient.cache.readQuery<GetProjectsQueryResponse>({
				query: GET_PROJECTS_QUERY,
			})

			const currentProject = existing?.projects.find(p => p.id === id)

			return {
				__typename: 'Mutation',
				updateProject: {
					__typename: 'Project',
					id,
					title: input.title ?? currentProject?.title ?? '',
					description: input.description ?? currentProject?.description ?? '',
					members: [],
					createdAt: currentProject?.createdAt ?? new Date().toISOString(),
					taskCounts: currentProject?.taskCounts ?? {
						__typename: 'TaskCounts',
						TODO: 0,
						IN_PROGRESS: 0,
						DONE: 0,
					},
				},
			}
		},
		update(cache, { data }, { variables }) {
			if (!data?.updateProject || !variables) return

			const { id } = variables

			const existing = cache.readQuery<GetProjectsQueryResponse>({
				query: GET_PROJECTS_QUERY,
			})

			if (existing) {
				cache.writeQuery<GetProjectsQueryResponse>({
					query: GET_PROJECTS_QUERY,
					data: {
						projects: existing.projects.map(p =>
							p.id === id ? data.updateProject : p
						),
					},
				})
			}

			try {
				cache.writeQuery<GetProjectByIdQueryResponse>({
					query: GET_PROJECT_BY_ID_QUERY,
					variables: { id },
					data: {
						project: data.updateProject,
					},
				})
			} catch {
				// Query not in cache
			}
		},
	})

	const updateProject = async (
		id: string,
		input: Partial<CreateProjectData>
	) => {
		const result = await updateProjectMutation({ variables: { id, input } })
		return result.data?.updateProject || null
	}

	return {
		updateProject,
		loading,
		error,
	}
}

// ==================== DELETE PROJECT ====================
export const useDeleteProject = () => {
	const [deleteProjectMutation, { loading, error }] = useMutation<
		DeleteProjectMutationResponse,
		{ id: string }
	>(DELETE_PROJECT_MUTATION, {
		optimisticResponse: () => ({
			__typename: 'Mutation',
			deleteProject: true,
		}),
		update(cache, { data }, { variables }) {
			if (!data?.deleteProject || !variables) return

			const { id } = variables

			const existing = cache.readQuery<GetProjectsQueryResponse>({
				query: GET_PROJECTS_QUERY,
			})

			if (existing) {
				cache.writeQuery<GetProjectsQueryResponse>({
					query: GET_PROJECTS_QUERY,
					data: {
						projects: existing.projects.filter(p => p.id !== id),
					},
				})
			}

			cache.evict({ id: cache.identify({ __typename: 'Project', id }) })
			cache.gc()
		},
	})

	const deleteProject = async (id: string) => {
		const result = await deleteProjectMutation({ variables: { id } })
		return result.data?.deleteProject || false
	}

	return {
		deleteProject,
		loading,
		error,
	}
}
