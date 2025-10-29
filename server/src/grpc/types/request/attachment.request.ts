export type ListByTaskRequest = {
  taskId: string;
};

export type DownloadByIdRequest = {
  id: string;
};

export type DeleteByIdRequest = {
  id: string;
};

export type UploadFileRequest = {
  taskId: string;
  originalName: string;
  mimeType: string;
  data: Buffer;
};
