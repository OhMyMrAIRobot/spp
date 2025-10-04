import axios from 'axios'
import type { ApiResponse } from '../../types/api/api-response'
import type { IAuthResponse } from '../../types/auth/auth-response'
import type { ILoginData } from '../../types/auth/login-data'
import type { IRegisterData } from '../../types/auth/register-data'
import { api } from './api'

const API_URL = import.meta.env.VITE_API_URL

const _api = axios.create({
	baseURL: `${API_URL}/auth/`,
	withCredentials: true,
})

export const loginApi = (data: ILoginData) =>
	_api.post<ApiResponse<IAuthResponse>>('login', data)

export const registerApi = (data: IRegisterData) =>
	_api.post<ApiResponse<IAuthResponse>>('register', data)

export const refreshApi = () =>
	_api.post<ApiResponse<IAuthResponse>>('refresh', {})

export const logoutApi = () => api.post('auth/logout')
