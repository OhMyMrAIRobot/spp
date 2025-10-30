/* eslint-disable @typescript-eslint/no-explicit-any */
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '../../utils/constants'
import { RefreshRequest } from '../generated/auth'
import { authClient } from './auth-client'

function attachTokens(meta: Record<string, string> = {}) {
	const accessToken = localStorage.getItem(ACCESS_TOKEN_NAME)
	const refreshToken = localStorage.getItem(REFRESH_TOKEN_NAME)
	return {
		...meta,
		...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
		...(refreshToken ? { refreshtoken: refreshToken } : {}),
	}
}

let refreshPromise: Promise<void> | null = null

async function ensureRefreshed(refreshToken: string): Promise<void> {
	if (refreshPromise) return refreshPromise

	refreshPromise = (async () => {
		try {
			const refreshCall = authClient.refresh(RefreshRequest.create({}), {
				meta: { refreshtoken: refreshToken },
			})
			const refreshResponse = await refreshCall.response

			localStorage.setItem(ACCESS_TOKEN_NAME, refreshResponse.accessToken)
			localStorage.setItem(REFRESH_TOKEN_NAME, refreshResponse.refreshToken)
		} catch (e) {
			localStorage.removeItem(ACCESS_TOKEN_NAME)
			localStorage.removeItem(REFRESH_TOKEN_NAME)
			throw e
		} finally {
			refreshPromise = null
		}
	})()

	return refreshPromise
}

export async function callWithAuth<Request, Response>(
	method: (
		request: Request,
		options?: { meta?: Record<string, string> }
	) => { response: Promise<Response> },
	request: Request,
	client: any
): Promise<Response> {
	try {
		const call = method.call(client, request, { meta: attachTokens() })
		return await call.response
	} catch (err: any) {
		if (err.code === 'UNAUTHENTICATED') {
			const refreshToken = localStorage.getItem(REFRESH_TOKEN_NAME)
			if (!refreshToken) throw err

			await ensureRefreshed(refreshToken)

			const retryCall = method.call(client, request, { meta: attachTokens() })
			return await retryCall.response
		}
		throw err
	}
}
