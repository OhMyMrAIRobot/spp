import { createApi } from '@reduxjs/toolkit/query/react'
import type { ApiResponse } from '../../types/api/api-response'
import type { IAttachment } from '../../types/attachments/attachment'
import { axiosBaseQuery } from '../api/axios-base-query'
import { taskApi } from './task-api-service'

type UploadArgs = {
	taskId: string
	projectId: string
	files: File[]
}

type DeleteArgs = {
	id: string
	taskId: string
	projectId: string
}

export const attachmentApi = createApi({
	reducerPath: 'AttachmentApi',
	baseQuery: axiosBaseQuery(),
	endpoints: builder => ({
		uploadToTask: builder.mutation<IAttachment[], UploadArgs>({
			query: ({ taskId, files }) => {
				const form = new FormData()
				files.forEach(f => form.append('files', f))
				return {
					url: `/attachments/tasks/${taskId}`,
					method: 'POST',
					data: form,
				}
			},
			transformResponse: (response: ApiResponse<IAttachment[]>) =>
				response.data ?? [],
			async onQueryStarted(
				{ taskId, projectId, files },
				{ dispatch, queryFulfilled }
			) {
				const tempIds: string[] = []
				const tempAttachments: IAttachment[] = files.map((f, i) => {
					const id = `temp-att-${Date.now()}-${i}`
					tempIds.push(id)
					return {
						id,
						originalName: f.name,
						size: f.size,
						uploadedBy: 'currentUserId',
						createdAt: new Date().toISOString(),
					}
				})

				const patch = dispatch(
					taskApi.util.updateQueryData(
						'getTasksByProject',
						projectId,
						draft => {
							const task = draft.find(t => t.id === taskId)
							if (task) {
								task.attachments.push(...tempAttachments)
							}
						}
					)
				)

				try {
					const { data: created } = await queryFulfilled
					dispatch(
						taskApi.util.updateQueryData(
							'getTasksByProject',
							projectId,
							draft => {
								const task = draft.find(t => t.id === taskId)
								if (!task) return
								task.attachments = task.attachments.filter(
									a => !tempIds.includes(a.id)
								)
								task.attachments.push(...created)
							}
						)
					)
				} catch {
					patch.undo()
				}
			},
		}),

		deleteAttachment: builder.mutation<{ success: boolean } | void, DeleteArgs>(
			{
				query: ({ id }) => ({
					url: `/attachments/${id}`,
					method: 'DELETE',
				}),
				async onQueryStarted(
					{ id, taskId, projectId },
					{ dispatch, queryFulfilled }
				) {
					const patch = dispatch(
						taskApi.util.updateQueryData(
							'getTasksByProject',
							projectId,
							draft => {
								const task = draft.find(t => t.id === taskId)
								if (!task) return
								task.attachments = task.attachments.filter(a => a.id !== id)
							}
						)
					)

					try {
						await queryFulfilled
					} catch {
						patch.undo()
					}
				},
			}
		),
	}),
})

export const { useUploadToTaskMutation, useDeleteAttachmentMutation } =
	attachmentApi
