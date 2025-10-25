import { GrpcUser } from './auth.response';

export type GetAllUsersResponse = {
  users: GrpcUser[];
};

export type GetUserByIdResponse = {
  user: GrpcUser;
};
