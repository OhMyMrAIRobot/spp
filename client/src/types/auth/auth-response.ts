import type { IUser } from '../users/user'

export interface IAuthResponse {
	user: IUser
	token: string
}
