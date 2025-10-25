import * as grpc from '@grpc/grpc-js';
import { ZodError, ZodTypeAny } from 'zod';
import { createGrpcError } from '../utils/grpc-error';

export const validateInterceptor = (schema: ZodTypeAny) => {
  return (
    call: grpc.ServerUnaryCall<any, any>,
    callback: (error: grpc.ServiceError | null) => void,
    next: () => void,
  ) => {
    try {
      const parsed = schema.parse(call.request);
      call.request = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const metadata = new grpc.Metadata();

        const errors = err.issues.map((issue) => ({
          path: issue.path.join('.') || 'request',
          message: issue.message,
        }));

        metadata.add('validation-errors', JSON.stringify(errors));

        const errorMessage = errors
          .map((e) => `${e.path}: ${e.message}`)
          .join('; ');

        return callback(
          createGrpcError(
            grpc.status.INVALID_ARGUMENT,
            `Validation error: ${errorMessage}`,
            metadata,
          ),
        );
      }
      return callback(
        createGrpcError(grpc.status.INVALID_ARGUMENT, 'Validation failed'),
      );
    }
  };
};
