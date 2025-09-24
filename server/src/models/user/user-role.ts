export const UserRoleEnum = {
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
} as const;

export type UserRoleEnum = keyof typeof UserRoleEnum;
