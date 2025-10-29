import type { ApiResponse } from '../types/api/api-response'
import type { IUser } from '../types/users/user'

export interface AuthState {
	user: IUser | null
	globalLoading: boolean
	loading: boolean
	error: ApiResponse<null> | null
}
