import { UserRoleEnum } from './user/user-role';

export type JwtPayload = {
  id: string;
  role: UserRoleEnum;
};
