import z from 'zod';
import { objectIdSchema } from './object-id.validation';

export const createProjectSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title cannot exceed 50 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(2000, 'Description cannot exceed 2000 characters'),
  members: z.array(objectIdSchema).optional(),
});

export const updateProjectSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title cannot exceed 50 characters')
    .optional(),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(2000, 'Description cannot exceed 2000 characters')
    .optional(),
  members: z.array(objectIdSchema).optional(),
});
