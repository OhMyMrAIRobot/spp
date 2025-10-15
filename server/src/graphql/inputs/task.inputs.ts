import { ITask } from '../../models/task';

export type TaskInput = Omit<ITask, 'id' | 'createdAt' | 'assignee'>;

export type CreateTaskInput = {
  input: TaskInput;
};

export type UpdateTaskInput = {
  id: string;
  input: Partial<TaskInput>;
};
