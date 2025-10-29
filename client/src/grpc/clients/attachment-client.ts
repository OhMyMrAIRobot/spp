import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport'
import { API_URL } from '../../utils/constants'
import {
	DeleteByIdRequest,
	DownloadByIdRequest,
	ListByTaskRequest,
	UploadFileRequest,
} from '../generated/attachment'
import { AttachmentServiceClient } from '../generated/attachment.client'
import { callWithAuth } from './grpc-client-wrapper'

const transport = new GrpcWebFetchTransport({ baseUrl: API_URL })
export const attachmentClient = new AttachmentServiceClient(transport)

export async function grpcGetAttachmentsByTask(taskId: string) {
	const request = ListByTaskRequest.create({ taskId })
	return callWithAuth(attachmentClient.listByTask, request, attachmentClient)
}

export async function grpcDeleteAttachment(id: string) {
	const request = DeleteByIdRequest.create({ id })
	return callWithAuth(attachmentClient.deleteById, request, attachmentClient)
}

export async function grpcDownloadAttachment(id: string) {
	const request = DownloadByIdRequest.create({ id })
	return callWithAuth(attachmentClient.downloadById, request, attachmentClient)
}

export async function grpcUploadToTask(taskId: string, file: File) {
	const arrayBuffer = await file.arrayBuffer()
	const request = UploadFileRequest.create({
		taskId,
		originalName: file.name,
		mimeType: file.type,
		data: new Uint8Array(arrayBuffer),
	})

	return callWithAuth(
		attachmentClient.uploadFileToTask,
		request,
		attachmentClient
	)
}
