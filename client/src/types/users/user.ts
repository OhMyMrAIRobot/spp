import type { UserRoleEnum } from './user-role-enum'

export interface IUser {
	id: string
	username: string
	role: UserRoleEnum
}
