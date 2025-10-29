import type { IAttachment } from '../../types/attachments/attachment'
import { Attachment } from '../generated/common'

export function mapAttachmentFromGrpc(a: Attachment): IAttachment {
	return {
		id: a.id,
		originalName: a.originalName ?? a.originalName ?? '',
		size: Number(a.size),
		uploadedBy: a.uploadedBy ?? a.uploadedBy ?? '',
		createdAt: a.createdAt ?? a.createdAt ?? '',
	}
}

export function mapAttachmentToGrpc(a: IAttachment): Attachment {
	return Attachment.create({
		id: a.id,
		originalName: a.originalName,
		uploadedBy: a.uploadedBy,
		createdAt: a.createdAt,
		size: BigInt(a.size),
	})
}
