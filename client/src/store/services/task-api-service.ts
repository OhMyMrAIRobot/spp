import { createApi } from '@reduxjs/toolkit/query/react'
import {
	grpcCreateTask,
	grpcDeleteTask,
	grpcGetTasksByProject,
	grpcUpdateTask,
} from '../../grpc/clients/task-client'
import { mapAttachmentFromGrpc } from '../../grpc/mappers/attachment.mapper'
import { taskStatusFromGrpc } from '../../grpc/mappers/task.mapper'
import { mapUserFromGrpc } from '../../grpc/mappers/user.mapper'
import type { CreateTaskData } from '../../types/tasks/create-task-data'
import type { ITaskExtended } from '../../types/tasks/task-extended'
import { projectApi } from './project-api-service'

export const taskApi = createApi({
	reducerPath: 'TaskApi',
	baseQuery: async () => ({ data: undefined }),
	tagTypes: ['Tasks', 'Projects'],
	endpoints: builder => ({
		getTasksByProject: builder.query<ITaskExtended[], string>({
			queryFn: async projectId => {
				try {
					const { tasks } = await grpcGetTasksByProject(projectId)
					const data = tasks.map(t => ({
						...t,
						status: taskStatusFromGrpc(t.status),
						user: mapUserFromGrpc(t.user!),
						attachments: t.attachments.map(at => mapAttachmentFromGrpc(at)),
					}))
					return { data }
				} catch (err) {
					return { error: err }
				}
			},
			providesTags: (result, _error, projectId) =>
				result
					? [
							...result.map(({ id }) => ({ type: 'Tasks' as const, id })),
							{ type: 'Tasks', id: projectId },
					  ]
					: [{ type: 'Tasks', id: projectId }],
		}),

		createTask: builder.mutation<ITaskExtended | undefined, CreateTaskData>({
			queryFn: async body => {
				try {
					const { task } = await grpcCreateTask(body)

					if (!task || !task.id) {
						return { error: new Error('Task not found') }
					}

					return {
						data: {
							...task,
							id: task.id,
							status: taskStatusFromGrpc(task.status),
							user: mapUserFromGrpc(task.user!),
							attachments: task.attachments?.map(mapAttachmentFromGrpc) ?? [],
						},
					}
				} catch (err) {
					return { error: err }
				}
			},
			invalidatesTags: (_result, _error, body) => [
				{ type: 'Tasks', id: body.projectId },
			],
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					await queryFulfilled
					dispatch(
						projectApi.util.invalidateTags([
							{ type: 'Projects', id: arg.projectId },
						])
					)
				} catch {
					//
				}
			},
		}),

		updateTask: builder.mutation<
			ITaskExtended | undefined,
			{ id: string; projectId: string; changes: Partial<CreateTaskData> }
		>({
			queryFn: async ({ id, changes }) => {
				try {
					const { task } = await grpcUpdateTask(id, changes)

					if (!task || !task.id) {
						return { error: new Error('Task update failed') }
					}

					return {
						data: {
							...task,
							id: task.id,
							status: taskStatusFromGrpc(task.status),
							user: mapUserFromGrpc(task.user!),
							attachments: task.attachments?.map(mapAttachmentFromGrpc) ?? [],
						},
					}
				} catch (err) {
					return { error: err }
				}
			},
			invalidatesTags: (_result, _error, { projectId }) => [
				{ type: 'Tasks', id: projectId },
			],
			async onQueryStarted({ projectId }, { dispatch, queryFulfilled }) {
				try {
					await queryFulfilled
					dispatch(
						projectApi.util.invalidateTags([
							{ type: 'Projects', id: projectId },
						])
					)
				} catch {
					//
				}
			},
		}),

		deleteTask: builder.mutation<
			{ success: boolean },
			{ id: string; projectId: string }
		>({
			queryFn: async ({ id }) => {
				try {
					await grpcDeleteTask(id)
					return { data: { success: true } }
				} catch (err) {
					return { error: err }
				}
			},
			invalidatesTags: (_result, _error, { projectId }) => [
				{ type: 'Tasks', id: projectId },
			],
			async onQueryStarted({ projectId }, { dispatch, queryFulfilled }) {
				try {
					await queryFulfilled
					dispatch(
						projectApi.util.invalidateTags([
							{ type: 'Projects', id: projectId },
						])
					)
				} catch {
					//
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
