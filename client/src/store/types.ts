import type { FormattedError } from '../graphql/utils/apollo-error-handler'
import type { IUser } from '../types/users/user'

export interface IAuthState {
	token: string | null
	user: IUser | null
	globalLoading: boolean
	loading: boolean
	error: FormattedError | null
}
