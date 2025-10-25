import { IAttachment } from '../../models/attachment';
import { PublicAttachment } from '../../types/attachment/public-attachment';

export function toGrpcAttachment(att: PublicAttachment) {
  return {
    id: att.id,
    originalName: att.originalName,
    size: att.size.toString(),
    uploadedBy: att.uploadedBy,
    createdAt: att.createdAt,
  };
}

export function toGrpcAttachmentFull(att: IAttachment) {
  return {
    id: att.id,
    taskId: att.taskId,
    projectId: att.projectId,
    originalName: att.originalName,
    mimeType: att.mimeType,
    size: att.size.toString(),
    storagePath: att.storagePath,
    uploadedBy: att.uploadedBy,
    createdAt: att.createdAt,
  };
}
