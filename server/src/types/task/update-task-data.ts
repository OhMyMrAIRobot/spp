import { CreateTaskData } from './create-task-data';

export type UpdateTaskData = Partial<Omit<CreateTaskData, 'projectId'>>;
