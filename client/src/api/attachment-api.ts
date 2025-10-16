import type { IAttachment } from '../types/attachments/attachment'
import { api } from './api'

export const downloadAttachmentApi = (id: string) =>
	api.get(`attachments/${id}/download`, { responseType: 'blob' })

export const uploadAttachmentsApi = async (
	taskId: string,
	files: File[]
): Promise<IAttachment[]> => {
	const formData = new FormData()

	const operations = {
		query: `
      mutation UploadAttachments($taskId: ID!, $files: [Upload!]!) {
        uploadAttachments(taskId: $taskId, files: $files) {
          id
          originalName
          mimeType
          size
          createdAt
          uploadedBy
        }
      }
    `,
		variables: {
			taskId,
			files: new Array(files.length).fill(null),
		},
	}
	formData.append('operations', JSON.stringify(operations))

	const map: Record<string, string[]> = {}
	files.forEach((_, index) => {
		map[index.toString()] = [`variables.files.${index}`]
	})
	formData.append('map', JSON.stringify(map))

	files.forEach((file, index) => {
		formData.append(`${index}`, file)
	})

	const response = await api.post('/graphql', formData, {
		headers: {
			'apollo-require-preflight': 'true',
		},
	})

	if (response.data.errors) {
		const nonAuthErrors = response.data.errors.filter(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(err: any) =>
				err.extensions?.code !== 'UNAUTHENTICATED' &&
				!err.message?.includes('Unauthorized') &&
				!err.message?.includes('Unauthenticated')
		)

		if (nonAuthErrors.length > 0) {
			throw new Error(nonAuthErrors[0]?.message || 'Upload failed')
		}
	}

	return response.data.data.uploadAttachments
}
