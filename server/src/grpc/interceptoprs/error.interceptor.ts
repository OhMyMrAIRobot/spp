import * as grpc from '@grpc/grpc-js';
import { AppError } from '../../types/http/error/app-error';
import { createGrpcError } from '../utils/grpc-error';

export const errorInterceptor = (
  error: any,
  call: grpc.ServerUnaryCall<any, any>,
  callback: grpc.sendUnaryData<any>,
) => {
  if (error instanceof AppError) {
    const grpcStatus = httpStatusToGrpcStatus(error.status);
    return callback(createGrpcError(grpcStatus, error.message));
  }

  if (error.code && error.details) {
    return callback(error);
  }

  console.error('Unhandled error:', error);
  return callback(
    createGrpcError(grpc.status.INTERNAL, 'Internal server error'),
  );
};

function httpStatusToGrpcStatus(httpStatus: number): grpc.status {
  switch (httpStatus) {
    case 400:
      return grpc.status.INVALID_ARGUMENT;
    case 401:
      return grpc.status.UNAUTHENTICATED;
    case 403:
      return grpc.status.PERMISSION_DENIED;
    case 404:
      return grpc.status.NOT_FOUND;
    case 409:
      return grpc.status.ALREADY_EXISTS;
    case 413:
      return grpc.status.RESOURCE_EXHAUSTED;
    case 500:
      return grpc.status.INTERNAL;
    default:
      return grpc.status.UNKNOWN;
  }
}
