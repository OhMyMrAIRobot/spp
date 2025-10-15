import type { IAttachment } from '../../types/attachments/attachment'

export type GetAttachmentsByTaskQueryResponse = {
	attachmentsByTask: IAttachment[]
}

export type UploadAttachmentsMutationResponse = {
	uploadAttachments: IAttachment[]
}

export type DeleteAttachmentMutationResponse = {
	deleteAttachment: boolean
}
