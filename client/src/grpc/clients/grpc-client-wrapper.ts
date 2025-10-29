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

export async function callWithAuth<Request, Response>(
	method: (
		request: Request,
		options?: { meta?: Record<string, string> }
	) => { response: Promise<Response> },
	request: Request,
	client: any // добавляем
): Promise<Response> {
	try {
		const call = method.call(client, request, { meta: attachTokens() }) // используем client
		return await call.response
	} catch (err: any) {
		if (err.code === 'UNAUTHENTICATED') {
			const refreshToken = localStorage.getItem(REFRESH_TOKEN_NAME)
			if (!refreshToken) throw err

			const refreshCall = authClient.refresh(RefreshRequest.create({}), {
				meta: { refreshtoken: refreshToken },
			})
			const refreshResponse = await refreshCall.response

			localStorage.setItem(ACCESS_TOKEN_NAME, refreshResponse.accessToken)
			localStorage.setItem(REFRESH_TOKEN_NAME, refreshResponse.refreshToken)

			const retryCall = method.call(client, request, { meta: attachTokens() }) // снова правильный клиент
			return await retryCall.response
		}
		throw err
	}
}

export async function callWithAuthServerStream<Request, Response>(
	method: (
		request: Request,
		options?: { meta?: Record<string, string> }
	) => { responses: AsyncIterable<Response> },
	request: Request,
	client: any
) {
	try {
		return method.call(client, request, { meta: attachTokens() })
	} catch (err: any) {
		if (err.code === 'UNAUTHENTICATED') {
			const refreshToken = localStorage.getItem(REFRESH_TOKEN_NAME)
			if (!refreshToken) throw err

			const refreshCall = authClient.refresh(RefreshRequest.create({}), {
				meta: { refreshtoken: refreshToken },
			})
			await refreshCall.response

			return method.call(client, request, { meta: attachTokens() })
		}
		throw err
	}
}

export async function callWithAuthClientStream<Request, Response>(
	method: (options?: { meta?: Record<string, string> }) => {
		requests: { send(msg: Request): Promise<void>; complete(): Promise<void> }
		response: Promise<Response>
	},
	meta: Record<string, string> = {},
	client: any
) {
	try {
		return method.call(client, { meta: attachTokens(meta) })
	} catch (err: any) {
		if (err.code === 'UNAUTHENTICATED') {
			const refreshToken = localStorage.getItem(REFRESH_TOKEN_NAME)
			if (!refreshToken) throw err

			const refreshCall = authClient.refresh(RefreshRequest.create({}), {
				meta: { refreshtoken: refreshToken },
			})
			await refreshCall.response

			return method.call(client, { meta: attachTokens(meta) })
		}
		throw err
	}
}
