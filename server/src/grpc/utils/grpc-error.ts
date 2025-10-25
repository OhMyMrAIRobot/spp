import * as grpc from '@grpc/grpc-js';

export function createGrpcError(
  code: grpc.status,
  message: string,
  metadata?: grpc.Metadata,
): grpc.ServiceError {
  const error = new Error(message) as grpc.ServiceError;
  error.code = code;
  error.details = message;
  error.metadata = metadata || new grpc.Metadata();
  return error;
}

export function handleGrpcError(error: any, callback: grpc.sendUnaryData<any>) {
  if (error.code && error.details) {
    return callback(error);
  }

  console.error('Unexpected error:', error);
  callback(
    createGrpcError(grpc.status.INTERNAL, error.message || 'Internal error'),
  );
}
