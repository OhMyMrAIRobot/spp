/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
	AxiosError,
	type AxiosRequestConfig,
	type AxiosResponse,
} from 'axios'

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

const REFRESH_QUERY = `
	mutation Refresh {
		refresh {
			token
			user {
				id
				username
				role
			}
		}
	}
`

const refreshTokenViaGraphQL = async (): Promise<string> => {
	const response = await axios.post(
		`${API_URL}/graphql`,
		{
			query: REFRESH_QUERY,
		},
		{
			withCredentials: true,
			headers: {
				'Content-Type': 'application/json',
			},
		}
	)

	if (response.data.errors) {
		throw new Error(response.data.errors[0]?.message || 'Refresh failed')
	}

	const newToken = response.data.data?.refresh?.token

	if (!newToken) {
		throw new Error('No token in refresh response')
	}
	return newToken
}

const handle401AndRefresh = async (
	originalRequest: AxiosRequestConfig
): Promise<AxiosResponse> => {
	if (originalRequest._isRetry) {
		throw new Error('Token refresh failed')
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
		const newToken = await refreshTokenViaGraphQL()

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
		localStorage.removeItem('username')
		throw err
	} finally {
		isRefreshing = false
	}
}

api.interceptors.response.use(
	async (response: AxiosResponse) => {
		if (response.data?.errors) {
			const hasUnauthenticatedError = response.data.errors.some(
				(err: any) =>
					err.extensions?.code === 'UNAUTHENTICATED' ||
					err.message?.includes('Unauthorized') ||
					err.message?.includes('Unauthenticated')
			)

			if (hasUnauthenticatedError) {
				return handle401AndRefresh(response.config)
			}
		}

		return response
	},
	async (error: AxiosError) => {
		const originalRequest = error.config as AxiosRequestConfig
		const status = error.response?.status

		if (status !== 401) {
			return Promise.reject(error)
		}

		return handle401AndRefresh(originalRequest)
	}
)
