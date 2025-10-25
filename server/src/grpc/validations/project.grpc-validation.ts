import { Types } from 'mongoose';
import z from 'zod';

export const objectIdGrpcSchema = z
  .string()
  .refine((val) => Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
  });

export const createProjectGrpcSchema = z.object({
  title: z
    .string()
    .min(3, 'Project title must be at least 3 characters')
    .max(50, 'Project title cannot exceed 50 characters'),
  description: z
    .string()
    .min(1, 'Project description is required')
    .max(2000, 'Project description cannot exceed 2000 characters'),
  members: z.array(objectIdGrpcSchema).optional(),
});

export const updateProjectGrpcSchema = z.object({
  id: objectIdGrpcSchema,
  title: z
    .string()
    .min(3, 'Project title must be at least 3 characters')
    .max(50, 'Project title cannot exceed 50 characters')
    .optional(),
  description: z
    .string()
    .min(1, 'Project description is required')
    .max(2000, 'Project description cannot exceed 2000 characters')
    .optional(),
  members: z.array(objectIdGrpcSchema).optional(),
});

export const getProjectByIdGrpcSchema = z.object({
  id: objectIdGrpcSchema,
});

export const deleteProjectGrpcSchema = z.object({
  id: objectIdGrpcSchema,
});
