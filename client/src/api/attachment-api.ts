import type { IAttachment } from '../types/attachments/attachment'
import { api } from './api'

const API_URL = import.meta.env.VITE_API_URL

export const downloadAttachmentApi = (id: string) =>
	api.get(`attachments/${id}/download`, { responseType: 'blob' })

export const uploadAttachmentsApi = async (
	taskId: string,
	files: File[]
): Promise<IAttachment[]> => {
	const token = localStorage.getItem('token')

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

	const response = await fetch(`${API_URL}/graphql`, {
		method: 'POST',
		headers: {
			authorization: token ? `Bearer ${token}` : '',
			'apollo-require-preflight': 'true',
		},
		credentials: 'include',
		body: formData,
	})

	if (!response.ok) {
		throw new Error(`Upload failed: ${response.statusText}`)
	}

	const result = await response.json()

	if (result.errors) {
		throw new Error(result.errors[0]?.message || 'Upload failed')
	}

	return result.data.uploadAttachments
}
