// grpc-client.ts
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport'
import { API_URL, REFRESH_TOKEN_NAME } from '../../utils/constants'
import {
	LoginRequest,
	LogoutRequest,
	RefreshRequest,
	RegisterRequest,
} from '../generated/auth'
import { AuthServiceClient } from '../generated/auth.client'
import { callWithAuth } from './grpc-client-wrapper'

const transport = new GrpcWebFetchTransport({
	baseUrl: API_URL,
})

export const authClient = new AuthServiceClient(transport)

export async function grpcLogin(username: string, password: string) {
	const request = LoginRequest.create({ username, password })
	const response = await authClient.login(request)
	return response.response
}

export async function grpcRegister(username: string, password: string) {
	const request = RegisterRequest.create({ username, password })
	const response = await authClient.register(request)
	return response.response
}

export async function grpcRefresh() {
	const refreshToken = localStorage.getItem(REFRESH_TOKEN_NAME) || ''
	const request = RefreshRequest.create({})
	const response = await authClient.refresh(request, {
		meta: { refreshtoken: refreshToken },
	})
	return response.response
}

export async function grpcLogout() {
	const request = LogoutRequest.create({})
	await callWithAuth(authClient.logout, request, authClient)
}
