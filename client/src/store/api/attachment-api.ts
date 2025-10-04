import { api } from './api'

export const downloadAttachmentApi = (id: string) =>
	api.get(`attachments/${id}/download`, { responseType: 'blob' })
