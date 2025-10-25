export type ListByTaskRequest = {
  taskId: string;
};

export type UploadMetadata = {
  taskId: string;
  originalName: string;
  mimeType: string;
};

export type UploadChunk = {
  metadata?: UploadMetadata;
  chunk?: Buffer;
};

export type DownloadByIdRequest = {
  id: string;
};

export type DeleteByIdRequest = {
  id: string;
};
