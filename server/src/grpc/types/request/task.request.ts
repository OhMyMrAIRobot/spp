export type GetAllTasksRequest = {};

export type GetTaskByIdRequest = {
  id: string;
};

export type GetTasksByProjectRequest = {
  projectId: string;
};

export type CreateTaskRequest = {
  title: string;
  description: string;
  projectId: string;
  dueDate?: string;
  status: number;
};

export type UpdateTaskRequest = {
  id: string;
  title?: string;
  description?: string;
  dueDate?: string;
  status?: number;
};

export type DeleteTaskRequest = {
  id: string;
};
