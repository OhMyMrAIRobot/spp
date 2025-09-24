import type { ITask } from './task'

export type CreateTaskData = Omit<ITask, 'id' | 'createdAt' | 'assignee'>
