import * as grpc from '@grpc/grpc-js';
import { errorInterceptor } from '../interceptoprs/error.interceptor';
import { handleGrpcError } from './grpc-error';

export function wrapUnaryCall<Request, Response>(
  handler: (call: any, request: Request) => Promise<Response>,
) {
  return async (call: any, callback: any) => {
    try {
      const response = await handler(call, call.request);
      callback(null, response);
    } catch (error) {
      errorInterceptor(error, call, callback);
    }
  };
}

export function wrapStreamCall<TRequest, TResponse>(
  handler: (
    call: grpc.ServerWritableStream<TRequest, TResponse>,
  ) => Promise<void>,
) {
  return async (call: grpc.ServerWritableStream<TRequest, TResponse>) => {
    try {
      await handler(call);
      call.end();
    } catch (error) {
      handleGrpcError(error, (err) => {
        if (err) {
          call.destroy(err as Error);
        }
      });
    }
  };
}
