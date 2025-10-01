import { ITask } from '../../../models/task';

export type TaskParams = {
  id: string;
  projectId: string;
};

export type CreateTaskBody = Omit<ITask, 'id' | 'createdAt' | 'assignee'>;

export type UpdateTaskBody = Partial<Omit<CreateTaskBody, 'projectId'>>;
