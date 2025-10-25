import { UserRoleEnum } from '../../types/user/user-role';
import { UserWithoutPassword } from '../../types/user/user-without-password';

export function toGrpcUserRole(role: UserRoleEnum): number {
  switch (role) {
    case 'ADMIN':
      return 1;
    case 'MEMBER':
      return 2;
    default:
      return 0;
  }
}

export function fromGrpcUserRole(role: number): UserRoleEnum {
  switch (role) {
    case 1:
      return 'ADMIN';
    case 2:
      return 'MEMBER';
    default:
      return 'MEMBER';
  }
}

export function toGrpcUser(user: UserWithoutPassword) {
  return {
    id: user.id,
    username: user.username,
    role: toGrpcUserRole(user.role),
  };
}
