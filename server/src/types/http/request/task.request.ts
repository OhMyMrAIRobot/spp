import { ITask } from '../../../models/task/task';

export type TaskParams = {
  id: string;
  projectId: string;
};

export type CreateTaskBody = Omit<ITask, '_id' | 'createdAt'>;

export type UpdateTaskBody = Partial<CreateTaskBody>;
