import type { IAuthResponse } from '../../types/auth/auth-response'

export type LoginMutationResponse = {
	login: IAuthResponse
}

export type RegisterMutationResponse = {
	register: IAuthResponse
}

export type RefreshMutationResponse = {
	refresh: IAuthResponse
}

export type LogoutMutationResponse = {
	logout: boolean
}
