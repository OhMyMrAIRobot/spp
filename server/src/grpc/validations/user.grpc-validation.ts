import z from 'zod';
import { objectIdGrpcSchema } from './project.grpc-validation';

export const getUserByIdGrpcSchema = z.object({
  id: objectIdGrpcSchema,
});
