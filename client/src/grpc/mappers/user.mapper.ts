import type { IUser } from '../../types/users/user'
import { UserRoleEnum } from '../../types/users/user-role-enum'
import type { User } from '../generated/common'

export const mapUserFromGrpc = (grpcUser?: User): IUser => {
	if (!grpcUser)
		return { id: '0', username: 'username', role: UserRoleEnum.ADMIN }
	let role: IUser['role'] = 'MEMBER'
	if (grpcUser.role === 1) role = 'ADMIN'
	else if (grpcUser.role === 2) role = 'MEMBER'
	return {
		id: grpcUser.id,
		username: grpcUser.username,
		role,
	}
}
