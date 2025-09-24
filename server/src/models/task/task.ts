import { TaskStatusEnum } from './task-status';

export interface ITask {
  id: string;
  title: string;
  description: string;
  status: TaskStatusEnum;
  assignee: string;
  createdAt: string;
  dueDate?: string;
  projectId: string;
}
