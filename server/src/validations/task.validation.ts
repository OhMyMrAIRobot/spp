import { z } from 'zod';
import { TaskStatusEnum } from '../models/task/task-status';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string(),
  assignee: z.string().min(1, 'Assignee is required'),
  dueDate: z.string().optional(),
  status: z
    .enum(Object.values(TaskStatusEnum) as [string, ...string[]])
    .default(TaskStatusEnum.TODO),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required').optional(),
  description: z.string().optional(),
  assignee: z.string().min(1, 'Assignee is required').optional(),
  projectId: z.string('Invalid project ID').optional(),
  dueDate: z.string().optional(),
  status: z
    .enum(Object.values(TaskStatusEnum) as [string, ...string[]])
    .optional(),
});
