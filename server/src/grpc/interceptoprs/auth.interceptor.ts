import * as grpc from '@grpc/grpc-js';
import { ErrorMessages } from '../../constants/error-messages';
import { tokenService } from '../../services/token.service';
import { JwtPayload } from '../../types/jwt-payload';
import { UserRoleEnum } from '../../types/user/user-role';
import { createGrpcError } from '../utils/grpc-error';

export interface AuthenticatedCall extends grpc.ServerUnaryCall<any, any> {
  user?: JwtPayload;
}

export const authenticateInterceptor = (
  call: AuthenticatedCall,
  callback: (error: grpc.ServiceError | null) => void,
  next: () => void,
) => {
  const metadata = call.metadata;
  const authHeader = metadata.get('authorization')[0] as string | undefined;

  if (!authHeader) {
    return callback(
      createGrpcError(grpc.status.UNAUTHENTICATED, ErrorMessages.UNAUTHORIZED),
    );
  }

  const token = authHeader.replace('Bearer ', '');

  if (!token) {
    return callback(
      createGrpcError(grpc.status.UNAUTHENTICATED, ErrorMessages.UNAUTHORIZED),
    );
  }

  try {
    const payload = tokenService.verifyAccessToken(token);
    call.user = payload;
    next();
  } catch (error) {
    return callback(
      createGrpcError(grpc.status.UNAUTHENTICATED, ErrorMessages.UNAUTHORIZED),
    );
  }
};

export const authorizeInterceptor = (roles: UserRoleEnum[]) => {
  return (
    call: AuthenticatedCall,
    callback: (error: grpc.ServiceError | null) => void,
    next: () => void,
  ) => {
    if (!call.user) {
      return callback(
        createGrpcError(
          grpc.status.UNAUTHENTICATED,
          ErrorMessages.UNAUTHORIZED,
        ),
      );
    }

    if (!roles.includes(call.user.role)) {
      return callback(
        createGrpcError(grpc.status.PERMISSION_DENIED, ErrorMessages.FORBIDDEN),
      );
    }

    next();
  };
};
