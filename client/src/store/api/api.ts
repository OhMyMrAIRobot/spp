import axios, { AxiosError, type AxiosRequestConfig } from 'axios'
import type { ApiResponse } from '../../types/api/api-response'
import type { IAuthResponse } from '../../types/auth/auth-response'

const API_URL = import.meta.env.VITE_API_URL

export const api = axios.create({
	baseURL: `${API_URL}`,
	withCredentials: true,
})

declare module 'axios' {
	export interface AxiosRequestConfig {
		_isRetry?: boolean
	}
}

api.interceptors.request.use(config => {
	const token = localStorage.getItem('token')
	if (token) config.headers.Authorization = `Bearer ${token}`
	return config
})

let isRefreshing = false
let failedQueue: Array<{
	resolve: (token: string) => void
	reject: (err: unknown) => void
}> = []

const processQueue = (error: unknown | null, token: string | null = null) => {
	failedQueue.forEach(p => {
		if (error) {
			p.reject(error)
		} else if (token) {
			p.resolve(token)
		}
	})
	failedQueue = []
}

api.interceptors.response.use(
	response => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as AxiosRequestConfig

		const status = error.response?.status
		if (status !== 401) {
			return Promise.reject(error)
		}

		if (originalRequest._isRetry) {
			return Promise.reject(error)
		}
		originalRequest._isRetry = true

		if (isRefreshing) {
			return new Promise((resolve, reject) => {
				failedQueue.push({
					resolve: (token: string) => {
						originalRequest.headers = originalRequest.headers ?? {}
						originalRequest.headers.Authorization = `Bearer ${token}`
						resolve(api.request(originalRequest))
					},
					reject,
				})
			})
		}

		isRefreshing = true
		try {
			const { data } = await axios.post<ApiResponse<IAuthResponse>>(
				`${API_URL}/auth/refresh`,
				{},
				{ withCredentials: true }
			)

			const newToken = data.data?.token

			if (!newToken) {
				throw new Error('No token in refresh response')
			}

			localStorage.setItem('token', newToken)

			api.defaults.headers.common.Authorization = `Bearer ${newToken}`

			processQueue(null, newToken)

			originalRequest.headers = originalRequest.headers ?? {}
			originalRequest.headers.Authorization = `Bearer ${newToken}`
			return api.request(originalRequest)
		} catch (err) {
			processQueue(err, null)
			localStorage.removeItem('token')
			localStorage.removeItem('refreshToken')
			return Promise.reject(err)
		} finally {
			isRefreshing = false
		}
	}
)
