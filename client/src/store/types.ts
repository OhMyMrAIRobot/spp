import type { ApiResponse } from '../types/api-response'
import type { IUser } from '../types/user/user'

export interface AuthState {
	token: string | null
	user: IUser | null
	globalLoading: boolean
	loading: boolean
	error: ApiResponse<null> | null
}
