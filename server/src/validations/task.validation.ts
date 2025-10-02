import { z } from 'zod';
import { TaskStatusEnum } from '../types/task/task-status';
import { objectIdSchema } from './object-id.validation';

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(2000, 'Description cannot exceed 1000 characters'),
  projectId: objectIdSchema,
  dueDate: z.string().optional(),
  status: z
    .enum(Object.values(TaskStatusEnum) as [string, ...string[]])
    .default(TaskStatusEnum.TODO),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters')
    .optional(),
  description: z.string().optional(),
  projectId: objectIdSchema.optional(),
  dueDate: z.string().optional(),
  status: z
    .enum(Object.values(TaskStatusEnum) as [string, ...string[]])
    .optional(),
});
