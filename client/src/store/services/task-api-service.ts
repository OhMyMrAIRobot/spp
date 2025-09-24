import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { ApiResponse } from '../../types/api-response'
import type { CreateTaskData } from '../../types/tasks/create-task-data'
import type { ITask } from '../../types/tasks/task'
import { projectApi } from './project-api-service'

const SERVER_URL = import.meta.env.VITE_API_URL

export const taskApi = createApi({
	reducerPath: 'TaskApi',
	baseQuery: fetchBaseQuery({ baseUrl: SERVER_URL }),
	endpoints: builder => ({
		getTasksByProject: builder.query<ITask[], string>({
			query: projectId => `/tasks/project/${projectId}`,
			transformResponse: (response: ApiResponse<ITask[]>) =>
				response.data ?? [],
		}),

		createTask: builder.mutation<ITask | undefined, CreateTaskData>({
			query: body => ({
				url: '/tasks',
				method: 'POST',
				body,
			}),
			transformResponse: (response: ApiResponse<ITask>) => response.data,
			async onQueryStarted(body, { dispatch, queryFulfilled }) {
				const tempId = `temp-${Date.now()}`
				const tempTask: ITask = {
					id: tempId,
					title: body.title,
					description: body.description,
					assignee: '',
					dueDate: body.dueDate,
					status: body.status,
					projectId: body.projectId,
					createdAt: new Date().toISOString(),
				}

				const patchTasksByProject = dispatch(
					taskApi.util.updateQueryData(
						'getTasksByProject',
						body.projectId,
						draft => {
							draft.push(tempTask)
						}
					)
				)

				try {
					const { data: realTask } = await queryFulfilled
					if (realTask) {
						dispatch(
							taskApi.util.updateQueryData(
								'getTasksByProject',
								body.projectId,
								draft => {
									const index = draft.findIndex(t => t.id === tempId)
									if (index !== -1) draft[index] = realTask
								}
							)
						)

						dispatch(
							projectApi.util.invalidateTags([
								{ type: 'Projects', id: body.projectId },
							])
						)
					} else {
						patchTasksByProject.undo()
					}
				} catch {
					patchTasksByProject.undo()
				}
			},
		}),

		updateTask: builder.mutation<
			ITask | undefined,
			{ id: string; projectId: string; changes: Partial<CreateTaskData> }
		>({
			query: ({ id, changes }) => ({
				url: `/tasks/${id}`,
				method: 'PATCH',
				body: changes,
			}),
			transformResponse: (response: ApiResponse<ITask>) => response.data,
			async onQueryStarted(
				{ id, projectId, changes },
				{ dispatch, queryFulfilled }
			) {
				const patchTasksByProject = dispatch(
					taskApi.util.updateQueryData(
						'getTasksByProject',
						projectId,
						draft => {
							const index = draft.findIndex(t => t.id === id)
							if (index !== -1) draft[index] = { ...draft[index], ...changes }
						}
					)
				)

				try {
					const { data: updatedTask } = await queryFulfilled
					if (updatedTask) {
						dispatch(
							taskApi.util.updateQueryData(
								'getTasksByProject',
								projectId,
								draft => {
									const index = draft.findIndex(t => t.id === id)
									if (index !== -1) draft[index] = updatedTask
								}
							)
						)

						dispatch(
							projectApi.util.invalidateTags([
								{ type: 'Projects', id: projectId },
							])
						)
					} else {
						patchTasksByProject.undo()
					}
				} catch {
					patchTasksByProject.undo()
				}
			},
		}),

		deleteTask: builder.mutation<
			{ success: boolean },
			{ id: string; projectId: string }
		>({
			query: ({ id }) => ({
				url: `/tasks/${id}`,
				method: 'DELETE',
			}),
			async onQueryStarted({ id, projectId }, { dispatch, queryFulfilled }) {
				const patchTasksByProject = dispatch(
					taskApi.util.updateQueryData(
						'getTasksByProject',
						projectId,
						draft => {
							return draft.filter(task => task.id !== id)
						}
					)
				)

				try {
					await queryFulfilled
					dispatch(
						projectApi.util.invalidateTags([
							{ type: 'Projects', id: projectId },
						])
					)
				} catch {
					patchTasksByProject.undo()
				}
			},
		}),
	}),
})

export const {
	useGetTasksByProjectQuery,
	useCreateTaskMutation,
	useUpdateTaskMutation,
	useDeleteTaskMutation,
} = taskApi
