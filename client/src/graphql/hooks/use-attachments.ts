import { useMutation, useQuery } from '@apollo/client/react'
import { useState } from 'react'
import { uploadAttachmentsApi } from '../../api/attachment-api'
import type { IAttachment } from '../../types/attachments/attachment'
import { apolloClient } from '../apollo-client'
import {
	DELETE_ATTACHMENT_MUTATION,
	GET_ATTACHMENTS_BY_TASK_QUERY,
} from '../queries/attachment.queries'
import { GET_TASKS_BY_PROJECT_QUERY } from '../queries/task.queries'
import type {
	DeleteAttachmentMutationResponse,
	GetAttachmentsByTaskQueryResponse,
} from '../responses/attachment.responses'
import type { GetTasksByProjectQueryResponse } from '../responses/task.responses'

// ==================== GET ATTACHMENTS BY TASK ====================
export const useGetAttachmentsByTask = (taskId: string) => {
	const { data, loading, error, refetch } =
		useQuery<GetAttachmentsByTaskQueryResponse>(GET_ATTACHMENTS_BY_TASK_QUERY, {
			variables: { taskId },
			skip: !taskId,
			fetchPolicy: 'cache-first',
			nextFetchPolicy: 'cache-first',
		})

	return {
		attachments: data?.attachmentsByTask || [],
		loading,
		error,
		refetch,
	}
}

// ==================== UPLOAD ATTACHMENTS ====================
export const useUploadAttachments = () => {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const uploadAttachments = async (
		taskId: string,
		projectId: string,
		files: File[]
	): Promise<IAttachment[]> => {
		setLoading(true)
		setError(null)

		try {
			const uploaded = await uploadAttachmentsApi(taskId, files)

			try {
				const tasks =
					apolloClient.cache.readQuery<GetTasksByProjectQueryResponse>({
						query: GET_TASKS_BY_PROJECT_QUERY,
						variables: { projectId },
					})

				if (tasks) {
					const updatedTasks = tasks.tasksByProject.map(task => {
						if (task.id === taskId) {
							return {
								...task,
								attachments: [...task.attachments, ...uploaded],
							}
						}
						return task
					})

					apolloClient.cache.writeQuery<GetTasksByProjectQueryResponse>({
						query: GET_TASKS_BY_PROJECT_QUERY,
						variables: { projectId },
						data: {
							tasksByProject: updatedTasks,
						},
					})
				}
			} catch {
				/* empty cache */
			}

			try {
				const existing =
					apolloClient.cache.readQuery<GetAttachmentsByTaskQueryResponse>({
						query: GET_ATTACHMENTS_BY_TASK_QUERY,
						variables: { taskId },
					})

				if (existing) {
					apolloClient.cache.writeQuery<GetAttachmentsByTaskQueryResponse>({
						query: GET_ATTACHMENTS_BY_TASK_QUERY,
						variables: { taskId },
						data: {
							attachmentsByTask: [...existing.attachmentsByTask, ...uploaded],
						},
					})
				}
			} catch {
				/* empty cache */
			}

			return uploaded
		} catch (err) {
			setError(err as Error)
			throw err
		} finally {
			setLoading(false)
		}
	}

	return {
		uploadAttachments,
		loading,
		error,
	}
}

// ==================== DELETE ATTACHMENT ====================
export const useDeleteAttachment = () => {
	const [deleteAttachmentMutation, { loading, error }] = useMutation<
		DeleteAttachmentMutationResponse,
		{ id: string; taskId: string; projectId: string }
	>(DELETE_ATTACHMENT_MUTATION, {
		optimisticResponse: () => ({
			__typename: 'Mutation',
			deleteAttachment: true,
		}),
		update(cache, { data }, { variables }) {
			if (!data?.deleteAttachment || !variables) return

			const { id, taskId, projectId } = variables

			try {
				const existing = cache.readQuery<GetAttachmentsByTaskQueryResponse>({
					query: GET_ATTACHMENTS_BY_TASK_QUERY,
					variables: { taskId },
				})

				if (existing) {
					cache.writeQuery<GetAttachmentsByTaskQueryResponse>({
						query: GET_ATTACHMENTS_BY_TASK_QUERY,
						variables: { taskId },
						data: {
							attachmentsByTask: existing.attachmentsByTask.filter(
								a => a.id !== id
							),
						},
					})
				}
			} catch {
				// Query not in cache
			}

			try {
				const tasks = cache.readQuery<GetTasksByProjectQueryResponse>({
					query: GET_TASKS_BY_PROJECT_QUERY,
					variables: { projectId },
				})

				if (tasks) {
					const updatedTasks = tasks.tasksByProject.map(task => {
						if (task.id === taskId) {
							return {
								...task,
								attachments: task.attachments.filter(a => a.id !== id),
							}
						}
						return task
					})

					cache.writeQuery<GetTasksByProjectQueryResponse>({
						query: GET_TASKS_BY_PROJECT_QUERY,
						variables: { projectId },
						data: {
							tasksByProject: updatedTasks,
						},
					})
				}
			} catch {
				// Tasks not in cache
			}

			cache.evict({ id: cache.identify({ __typename: 'Attachment', id }) })
			cache.gc()
		},
	})

	const deleteAttachment = async (
		id: string,
		taskId: string,
		projectId: string
	) => {
		const result = await deleteAttachmentMutation({
			variables: { id, taskId, projectId },
		})
		return result.data?.deleteAttachment || false
	}

	return {
		deleteAttachment,
		loading,
		error,
	}
}
