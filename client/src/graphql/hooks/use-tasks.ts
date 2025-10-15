import { useMutation, useQuery } from '@apollo/client/react'
import type { CreateTaskData } from '../../types/tasks/create-task-data'
import type { ITaskExtended } from '../../types/tasks/task-extended'
import { UserRoleEnum } from '../../types/users/user-role-enum'
import { apolloClient } from '../apollo-client'
import { GET_PROJECTS_QUERY } from '../queries/project.queries'
import {
	CREATE_TASK_MUTATION,
	DELETE_TASK_MUTATION,
	GET_TASKS_BY_PROJECT_QUERY,
	UPDATE_TASK_MUTATION,
} from '../queries/task.queries'
import type { GetProjectsQueryResponse } from '../responses/project.responses'
import type {
	CreateTaskMutationResponse,
	DeleteTaskMutationResponse,
	GetTasksByProjectQueryResponse,
	UpdateTaskMutationResponse,
} from '../responses/task.responses'

// ==================== GET TASKS BY PROJECT ====================
export const useGetTasksByProject = (projectId: string) => {
	const { data, loading, error, refetch } =
		useQuery<GetTasksByProjectQueryResponse>(GET_TASKS_BY_PROJECT_QUERY, {
			variables: { projectId },
			skip: !projectId,
			fetchPolicy: 'cache-first',
			nextFetchPolicy: 'cache-first',
		})

	return {
		tasks: data?.tasksByProject || [],
		loading,
		error,
		refetch,
	}
}

// ==================== CREATE TASK ====================
export const useCreateTask = () => {
	const [createTaskMutation, { loading, error }] = useMutation<
		CreateTaskMutationResponse,
		{ input: CreateTaskData }
	>(CREATE_TASK_MUTATION, {
		optimisticResponse: ({ input }) => {
			return {
				__typename: 'Mutation' as const,
				createTask: {
					__typename: 'Task' as const,
					id: `temp-${Date.now()}`,
					title: input.title,
					description: input.description,
					status: input.status,
					assignee: '',
					dueDate: input.dueDate ?? null,
					createdAt: new Date().toISOString(),
					projectId: input.projectId,
					user: {
						__typename: 'User' as const,
						id: '0',
						username: localStorage.getItem('username') || 'Unknown',
						role: UserRoleEnum.MEMBER,
					},
					attachments: [],
				} as ITaskExtended,
			}
		},
		update(cache, { data }, { variables }) {
			if (!data?.createTask || !variables) {
				return
			}

			const { projectId } = variables.input

			const existing = cache.readQuery<GetTasksByProjectQueryResponse>({
				query: GET_TASKS_BY_PROJECT_QUERY,
				variables: { projectId },
			})

			if (existing) {
				const newTasksList = [...existing.tasksByProject, data.createTask]

				cache.writeQuery<GetTasksByProjectQueryResponse>({
					query: GET_TASKS_BY_PROJECT_QUERY,
					variables: { projectId },
					data: {
						tasksByProject: newTasksList,
					},
				})
			}

			try {
				const projects = cache.readQuery<GetProjectsQueryResponse>({
					query: GET_PROJECTS_QUERY,
				})

				if (projects) {
					const updatedProjects = projects.projects.map(p => {
						if (p.id === projectId) {
							const newCount =
								(p.taskCounts[
									data.createTask.status as keyof typeof p.taskCounts
								] || 0) + 1

							return {
								...p,
								taskCounts: {
									...p.taskCounts,
									[data.createTask.status]: newCount,
								},
							}
						}
						return p
					})

					cache.writeQuery<GetProjectsQueryResponse>({
						query: GET_PROJECTS_QUERY,
						data: { projects: updatedProjects },
					})
				}
			} catch {
				// empty
			}
		},
	})

	const createTask = async (input: CreateTaskData) => {
		const result = await createTaskMutation({ variables: { input } })
		return result.data?.createTask || null
	}

	return {
		createTask,
		loading,
		error,
	}
}

// ==================== UPDATE TASK ====================
export const useUpdateTask = () => {
	const [updateTaskMutation, { loading, error }] = useMutation<
		UpdateTaskMutationResponse,
		{ id: string; input: Partial<CreateTaskData>; projectId: string }
	>(UPDATE_TASK_MUTATION, {
		optimisticResponse: ({ id, input, projectId }) => {
			const existing =
				apolloClient.cache.readQuery<GetTasksByProjectQueryResponse>({
					query: GET_TASKS_BY_PROJECT_QUERY,
					variables: { projectId },
				})

			const currentTask = existing?.tasksByProject.find(t => t.id === id)

			return {
				__typename: 'Mutation',
				updateTask: {
					__typename: 'Task',
					id,
					title: input.title ?? currentTask?.title ?? '',
					description: input.description ?? currentTask?.description ?? '',
					status: input.status ?? currentTask?.status ?? 'TODO',
					assignee: currentTask?.assignee ?? '',
					dueDate: input.dueDate ?? currentTask?.dueDate ?? null,
					createdAt: new Date().toISOString(),
					projectId: currentTask?.projectId ?? projectId,
					user: currentTask?.user ?? {
						__typename: 'User',
						id: '0',
						username: 'Unknown',
						role: UserRoleEnum.MEMBER,
					},
					attachments: currentTask?.attachments ?? [],
				} as ITaskExtended,
			}
		},
		update(cache, { data }, { variables }) {
			if (!data?.updateTask || !variables) return

			const { projectId, id } = variables
			const oldStatus = apolloClient.cache
				.readQuery<GetTasksByProjectQueryResponse>({
					query: GET_TASKS_BY_PROJECT_QUERY,
					variables: { projectId },
				})
				?.tasksByProject.find(t => t.id === id)?.status

			const existing = cache.readQuery<GetTasksByProjectQueryResponse>({
				query: GET_TASKS_BY_PROJECT_QUERY,
				variables: { projectId },
			})

			if (existing) {
				cache.writeQuery<GetTasksByProjectQueryResponse>({
					query: GET_TASKS_BY_PROJECT_QUERY,
					variables: { projectId },
					data: {
						tasksByProject: existing.tasksByProject.map(t =>
							t.id === id ? data.updateTask : t
						),
					},
				})
			}

			if (oldStatus && oldStatus !== data.updateTask.status) {
				try {
					const projects = cache.readQuery<GetProjectsQueryResponse>({
						query: GET_PROJECTS_QUERY,
					})

					if (projects) {
						const updatedProjects = projects.projects.map(p => {
							if (p.id === projectId) {
								return {
									...p,
									taskCounts: {
										...p.taskCounts,
										[oldStatus]: Math.max(
											0,
											(p.taskCounts[oldStatus as keyof typeof p.taskCounts] ||
												0) - 1
										),
										[data.updateTask.status]:
											(p.taskCounts[
												data.updateTask.status as keyof typeof p.taskCounts
											] || 0) + 1,
									},
								}
							}
							return p
						})

						cache.writeQuery<GetProjectsQueryResponse>({
							query: GET_PROJECTS_QUERY,
							data: { projects: updatedProjects },
						})
					}
				} catch {
					// Ignore if projects not in cache
				}
			}
		},
	})

	const updateTask = async (
		id: string,
		projectId: string,
		input: Partial<CreateTaskData>
	) => {
		const result = await updateTaskMutation({
			variables: { id, input, projectId },
		})
		return result.data?.updateTask || null
	}

	return {
		updateTask,
		loading,
		error,
	}
}

// ==================== DELETE TASK ====================
export const useDeleteTask = () => {
	const [deleteTaskMutation, { loading, error }] = useMutation<
		DeleteTaskMutationResponse,
		{ id: string; projectId: string }
	>(DELETE_TASK_MUTATION, {
		optimisticResponse: () => ({
			__typename: 'Mutation',
			deleteTask: true,
		}),
		update(cache, { data }, { variables }) {
			if (!data?.deleteTask || !variables) return

			const { id, projectId } = variables

			const existing = cache.readQuery<GetTasksByProjectQueryResponse>({
				query: GET_TASKS_BY_PROJECT_QUERY,
				variables: { projectId },
			})

			const deletedTask = existing?.tasksByProject.find(t => t.id === id)

			if (existing) {
				cache.writeQuery<GetTasksByProjectQueryResponse>({
					query: GET_TASKS_BY_PROJECT_QUERY,
					variables: { projectId },
					data: {
						tasksByProject: existing.tasksByProject.filter(t => t.id !== id),
					},
				})
			}

			if (deletedTask) {
				try {
					const projects = cache.readQuery<GetProjectsQueryResponse>({
						query: GET_PROJECTS_QUERY,
					})

					if (projects) {
						const updatedProjects = projects.projects.map(p => {
							if (p.id === projectId) {
								return {
									...p,
									taskCounts: {
										...p.taskCounts,
										[deletedTask.status]: Math.max(
											0,
											(p.taskCounts[
												deletedTask.status as keyof typeof p.taskCounts
											] || 0) - 1
										),
									},
								}
							}
							return p
						})

						cache.writeQuery<GetProjectsQueryResponse>({
							query: GET_PROJECTS_QUERY,
							data: { projects: updatedProjects },
						})
					}
				} catch {
					// Ignore if projects not in cache
				}
			}

			cache.evict({ id: cache.identify({ __typename: 'Task', id }) })
			cache.gc()
		},
	})

	const deleteTask = async (id: string, projectId: string) => {
		const result = await deleteTaskMutation({ variables: { id, projectId } })
		return result.data?.deleteTask || false
	}

	return {
		deleteTask,
		loading,
		error,
	}
}
