export type GrpcAttachment = {
  id: string;
  originalName: string;
  size: string;
  uploadedBy: string;
  createdAt: string;
};

export type GrpcAttachmentFull = {
  id: string;
  taskId: string;
  projectId: string;
  originalName: string;
  mimeType: string;
  size: string;
  storagePath: string;
  uploadedBy: string;
  createdAt: string;
};

export type ListByTaskResponse = {
  attachments: GrpcAttachmentFull[];
};

export type UploadResponse = {
  attachments: GrpcAttachment[];
};

export type DownloadMetadata = {
  originalName: string;
  mimeType: string;
  size: string;
};

export type DownloadChunk = {
  metadata?: DownloadMetadata;
  chunk?: Buffer;
};

export type DeleteByIdResponse = {};
