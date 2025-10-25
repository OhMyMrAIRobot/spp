import { userService } from '../../services/user.service';
import { toUserWithoutPassword } from '../../utils/common';
import { AuthenticatedCall } from '../interceptoprs/auth.interceptor';
import { toGrpcUser } from '../mappers/user.mapper';
import {
  GetAllUsersRequest,
  GetUserByIdRequest,
} from '../types/request/user.request';
import {
  GetAllUsersResponse,
  GetUserByIdResponse,
} from '../types/response/user.response';
import { wrapUnaryCall } from '../utils/call-wrapper';

export const userGrpcService = {
  getAll: wrapUnaryCall<GetAllUsersRequest, GetAllUsersResponse>(
    async (call: AuthenticatedCall, request: GetAllUsersRequest) => {
      const users = await userService.getAll();

      return {
        users: users.map((u) => toGrpcUser(toUserWithoutPassword(u))),
      };
    },
  ),

  getById: wrapUnaryCall<GetUserByIdRequest, GetUserByIdResponse>(
    async (call: AuthenticatedCall, request: GetUserByIdRequest) => {
      const { id } = request;

      const user = await userService.getById(id);

      return {
        user: toGrpcUser(toUserWithoutPassword(user)),
      };
    },
  ),
};
