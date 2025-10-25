import { z } from 'zod';
import { objectIdGrpcSchema } from './project.grpc-validation';

export const createTaskGrpcSchema = z.object({
  title: z
    .string()
    .min(3, 'Task title must be at least 3 characters')
    .max(100, 'Task title cannot exceed 100 characters'),
  description: z
    .string()
    .min(1, 'Task description is required')
    .max(2000, 'Task description cannot exceed 1000 characters'),
  projectId: objectIdGrpcSchema,
  dueDate: z.string().optional(),
  status: z.number().min(0).max(3).optional(),
});

export const updateTaskGrpcSchema = z.object({
  id: objectIdGrpcSchema,
  title: z
    .string()
    .min(3, 'Task title must be at least 3 characters')
    .max(100, 'Task title cannot exceed 100 characters')
    .optional(),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  status: z.coerce.number().min(0).max(3).optional(),
});

export const getTaskByIdGrpcSchema = z.object({
  id: objectIdGrpcSchema,
});

export const getTasksByProjectGrpcSchema = z.object({
  projectId: objectIdGrpcSchema,
});

export const deleteTaskGrpcSchema = z.object({
  id: objectIdGrpcSchema,
});
