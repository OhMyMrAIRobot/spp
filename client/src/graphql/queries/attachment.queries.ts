import { gql } from '@apollo/client'

export const UPLOAD_ATTACHMENTS_MUTATION = gql`
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
`

export const DELETE_ATTACHMENT_MUTATION = gql`
	mutation DeleteAttachment($id: ID!) {
		deleteAttachment(id: $id)
	}
`

export const GET_ATTACHMENTS_BY_TASK_QUERY = gql`
	query GetAttachmentsByTask($taskId: ID!) {
		attachmentsByTask(taskId: $taskId) {
			id
			originalName
			mimeType
			size
			createdAt
			uploadedBy
		}
	}
`
