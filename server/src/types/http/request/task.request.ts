import { TaskStatusEnum } from '../../../models/task/task-status';

export type TaskParams = {
  id: string;
  projectId: string;
};

export type CreateTaskBody = {
  title: string;
  description: string;
  status: TaskStatusEnum;
  assignee: string;
  dueDate?: string;
  projectId: string;
};

export type UpdateTaskBody = Partial<CreateTaskBody>;
