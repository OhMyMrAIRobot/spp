import { GrpcAttachment } from './attachment.response';
import { GrpcUser } from './auth.response';

export type GrpcTask = {
  id: string;
  title: string;
  description: string;
  status: number;
  assignee: string;
  createdAt: string;
  dueDate: string | undefined;
  projectId: string;
  user: GrpcUser;
  attachments: GrpcAttachment[];
};

export type GetAllTasksResponse = {
  tasks: GrpcTask[];
};

export type GetTaskByIdResponse = {
  task: GrpcTask;
};

export type GetTasksByProjectResponse = {
  tasks: GrpcTask[];
};

export type CreateTaskResponse = {
  task: GrpcTask;
};

export type UpdateTaskResponse = {
  task: GrpcTask;
};

export type DeleteTaskResponse = {};
