import z from 'zod';
import { objectIdSchema } from './object-id.validation';

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Project title is required'),
  description: z.string(),
  members: z.array(objectIdSchema).optional(),
});

export const updateProjectSchema = z.object({
  title: z.string().min(1, 'Project title is required').optional(),
  description: z.string().optional(),
  members: z.array(objectIdSchema).optional(),
});
