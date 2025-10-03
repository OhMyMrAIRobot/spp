import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import type { AxiosError, AxiosRequestConfig } from 'axios'
import { api } from './api'

export type AxiosBaseQueryArgs =
	| string
	| {
			url: string
			method?: AxiosRequestConfig['method']
			data?: unknown
			body?: unknown
			params?: unknown
			headers?: AxiosRequestConfig['headers']
	  }

type AxiosQueryError = { status: number; data: unknown }

export const axiosBaseQuery =
	(): BaseQueryFn<AxiosBaseQueryArgs, unknown, AxiosQueryError> =>
	async args => {
		try {
			let config: AxiosRequestConfig

			if (typeof args === 'string') {
				config = { url: args, method: 'get' }
			} else {
				const data = args.data !== undefined ? args.data : args.body

				config = {
					url: args.url,
					method: args.method ?? 'get',
					data,
					params: args.params,
					headers: args.headers,
				}
			}

			const result = await api.request(config)
			return { data: result.data }
		} catch (e) {
			const err = e as AxiosError
			return {
				error: {
					status: (err.response?.status ?? 500) as number,
					data: (err.response?.data ?? err.message) as unknown,
				},
			}
		}
	}
