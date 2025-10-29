import { createApi } from '@reduxjs/toolkit/query/react'
import {
	grpcDeleteAttachment,
	grpcDownloadAttachment,
	grpcGetAttachmentsByTask,
	grpcUploadToTask,
} from '../../grpc/clients/attachment-client'
import { extractGrpcError } from '../../grpc/utils/extract-grpc-error'
import type { IAttachment } from '../../types/attachments/attachment'
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
	baseQuery: async () => ({ data: undefined }),
	tagTypes: ['Attachments'],
	endpoints: builder => ({
		uploadToTask: builder.mutation<IAttachment[], UploadArgs>({
			queryFn: async ({ taskId, files }) => {
				try {
					const attachments: IAttachment[] = []

					for (const file of files) {
						const res = await grpcUploadToTask(taskId, file)
						attachments.push(
							...res.attachments.map(a => ({
								id: a.id,
								originalName: a.originalName,
								size: Number(a.size),
								uploadedBy: a.uploadedBy,
								createdAt: a.createdAt,
							}))
						)
					}

					return { data: attachments }
				} catch (err) {
					return { error: extractGrpcError(err, 'error') }
				}
			},
			async onQueryStarted({ taskId }, { dispatch, queryFulfilled }) {
				try {
					const { data: newAttachments } = await queryFulfilled
					dispatch(
						attachmentApi.util.updateQueryData(
							'getAttachmentsByTask',
							{ taskId },
							draft => {
								draft.push(...newAttachments)
							}
						)
					)
					dispatch(taskApi.util.invalidateTags([{ type: 'Tasks', id: taskId }]))
				} catch {
					//
				}
			},
		}),

		deleteAttachment: builder.mutation<void, DeleteArgs>({
			queryFn: async ({ id }) => {
				try {
					await grpcDeleteAttachment(id)
					return { data: undefined }
				} catch (err) {
					return { error: extractGrpcError(err, 'error') }
				}
			},
			async onQueryStarted({ taskId, id }, { dispatch, queryFulfilled }) {
				try {
					await queryFulfilled
					dispatch(
						attachmentApi.util.updateQueryData(
							'getAttachmentsByTask',
							{ taskId },
							draft => {
								const index = draft.findIndex(a => a.id === id)
								if (index !== -1) draft.splice(index, 1)
							}
						)
					)
					dispatch(taskApi.util.invalidateTags([{ type: 'Tasks', id: taskId }]))
				} catch {
					//
				}
			},
		}),

		getAttachmentsByTask: builder.query<IAttachment[], { taskId: string }>({
			queryFn: async ({ taskId }) => {
				try {
					const response = await grpcGetAttachmentsByTask(taskId)
					const attachments: IAttachment[] = response.attachments.map(a => ({
						id: a.id,
						originalName: a.originalName,
						size: Number(a.size),
						uploadedBy: a.uploadedBy,
						createdAt: a.createdAt,
					}))
					return { data: attachments }
				} catch (err) {
					return { error: extractGrpcError(err, 'error') }
				}
			},
			providesTags: (result, _, { taskId }) =>
				result
					? [{ type: 'Attachments', id: taskId }]
					: [{ type: 'Attachments', id: taskId }],
		}),

		downloadAttachment: builder.mutation<Uint8Array, string>({
			queryFn: async (id: string) => {
				try {
					const { data } = await grpcDownloadAttachment(id)
					return { data }
				} catch (err) {
					return { error: err }
				}
			},
		}),
	}),
})

export const {
	useUploadToTaskMutation,
	useDeleteAttachmentMutation,
	useGetAttachmentsByTaskQuery,
	useDownloadAttachmentMutation,
} = attachmentApi
