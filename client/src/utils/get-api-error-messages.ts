/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApiResponse } from '../types/api/api-response'

export type RTKApiError = {
	status: number
	data: unknown
}

export function getApiErrorMessages(err: unknown): string[] {
	if (err && typeof err === 'object' && 'data' in (err as any)) {
		const data = (err as RTKApiError).data as unknown

		if (typeof data === 'string') {
			return data.trim() ? [data] : []
		}

		if (data && typeof data === 'object') {
			const resp = data as ApiResponse<unknown>

			if (Array.isArray(resp.errors) && resp.errors.length) {
				return resp.errors
					.map(e => e?.message)
					.filter(
						(m): m is string => typeof m === 'string' && m.trim().length > 0
					)
			}

			if (typeof resp.message === 'string' && resp.message.trim()) {
				return [resp.message]
			}
		}

		return []
	}

	if (typeof err === 'string' && err.trim()) {
		return [err]
	}

	return []
}
