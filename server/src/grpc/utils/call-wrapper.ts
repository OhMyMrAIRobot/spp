import { errorInterceptor } from '../interceptoprs/error.interceptor';

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
