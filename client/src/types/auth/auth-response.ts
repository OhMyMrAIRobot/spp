import type { IUser } from '../user/user'

export interface IAuthResponse {
	user: IUser
	token: string
}
