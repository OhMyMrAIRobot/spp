import axios from 'axios'
import type { ApiResponse } from '../types/api-response'
import type { IAuthResponse } from '../types/auth/auth-response'
import type { ILoginData } from '../types/auth/login-data'
import type { IRegisterData } from '../types/auth/register-data'

const API_URL = import.meta.env.VITE_API_URL

const api = axios.create({
	baseURL: `${API_URL}/auth/`,
})

api.interceptors.request.use(config => {
	const token = localStorage.getItem('token')
	if (token) config.headers.Authorization = `Bearer ${token}`
	return config
})

export const loginApi = (data: ILoginData) =>
	api.post<ApiResponse<IAuthResponse>>('login', data)

export const registerApi = (data: IRegisterData) =>
	api.post<ApiResponse<IAuthResponse>>('register', data)

export const isAuthApi = () => api.post<ApiResponse<IAuthResponse>>('is-auth')
