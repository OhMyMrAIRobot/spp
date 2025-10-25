import * as grpc from '@grpc/grpc-js';
import { ErrorMessages } from '../../constants/error-messages';
import { authService } from '../../services/auth.service';
import { AppError } from '../../types/http/error/app-error';
import { UserRoleEnum } from '../../types/user/user-role';
import { AuthenticatedCall } from '../interceptoprs/auth.interceptor';
import { toGrpcUser } from '../mappers/user.mapper';
import {
  LoginRequest,
  LogoutRequest,
  RefreshRequest,
  RegisterRequest,
} from '../types/request/auth.request';
import { AuthResponse, LogoutResponse } from '../types/response/auth.response';
import { wrapUnaryCall } from '../utils/call-wrapper';

const REFRESH_TOKEN_NAME = 'refreshToken';

export const authGrpcService = {
  register: wrapUnaryCall<RegisterRequest, AuthResponse>(
    async (call: AuthenticatedCall, request: RegisterRequest) => {
      const { username, password } = request;

      const result = await authService.register(
        username,
        password,
        UserRoleEnum.MEMBER,
      );

      const responseMetadata = new grpc.Metadata();
      responseMetadata.add(REFRESH_TOKEN_NAME, result.refreshToken);
      call.sendMetadata(responseMetadata);

      return {
        accessToken: result.accessToken,
        user: toGrpcUser(result.user),
      };
    },
  ),

  login: wrapUnaryCall<LoginRequest, AuthResponse>(
    async (
      call: AuthenticatedCall,
      request: LoginRequest,
    ): Promise<AuthResponse> => {
      const { username, password } = request;

      const result = await authService.login(username, password);

      const responseMetadata = new grpc.Metadata();
      responseMetadata.add(REFRESH_TOKEN_NAME, result.refreshToken);
      call.sendMetadata(responseMetadata);

      return {
        accessToken: result.accessToken,
        user: toGrpcUser(result.user),
      };
    },
  ),

  refresh: wrapUnaryCall<RefreshRequest, AuthResponse>(
    async (
      call: AuthenticatedCall,
      request: RefreshRequest,
    ): Promise<AuthResponse> => {
      const refreshToken = call.metadata.get(REFRESH_TOKEN_NAME)[0] as string;

      if (!refreshToken) {
        throw new AppError(ErrorMessages.UNAUTHORIZED, 401);
      }

      const result = await authService.refresh(refreshToken);

      const responseMetadata = new grpc.Metadata();
      responseMetadata.add(REFRESH_TOKEN_NAME, result.refreshToken);
      call.sendMetadata(responseMetadata);

      return {
        accessToken: result.accessToken,
        user: toGrpcUser(result.user),
      };
    },
  ),

  logout: wrapUnaryCall<LogoutRequest, LogoutResponse>(
    async (call: AuthenticatedCall, request: LogoutRequest) => {
      const userId = call.user?.id;

      if (!userId) throw new AppError(ErrorMessages.UNAUTHORIZED, 401);

      await authService.logout(userId);

      return {};
    },
  ),
};
