import z from 'zod';
import { objectIdGrpcSchema } from './project.grpc-validation';

export const listByTaskGrpcSchema = z.object({
  taskId: objectIdGrpcSchema,
});

export const uploadMetadataGrpcSchema = z.object({
  taskId: objectIdGrpcSchema,
});

export const downloadByIdGrpcSchema = z.object({
  id: objectIdGrpcSchema,
});

export const deleteByIdGrpcSchema = z.object({
  id: objectIdGrpcSchema,
});
