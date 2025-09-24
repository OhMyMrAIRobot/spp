import z from 'zod';

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Project title is required'),
  description: z.string().optional(),
});

export const updateProjectSchema = z.object({
  title: z.string().min(1, 'Project title is required').optional(),
  description: z.string().optional(),
});
