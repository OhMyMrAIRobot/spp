import { z } from 'zod';
import { TaskStatusEnum } from '../types/task/task-status';
import { objectIdSchema } from './object-id.validation';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().min(1, 'Description is required'),
  projectId: objectIdSchema,
  dueDate: z.string().optional(),
  status: z
    .enum(Object.values(TaskStatusEnum) as [string, ...string[]])
    .default(TaskStatusEnum.TODO),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required').optional(),
  description: z.string().optional(),
  projectId: objectIdSchema.optional(),
  dueDate: z.string().optional(),
  status: z
    .enum(Object.values(TaskStatusEnum) as [string, ...string[]])
    .optional(),
});
