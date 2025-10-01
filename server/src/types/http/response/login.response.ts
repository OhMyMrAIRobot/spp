import { UserWithoutPassword } from '../../user/user-without-password';

export type LoginResponse = {
  token: string;
  user: UserWithoutPassword;
};
