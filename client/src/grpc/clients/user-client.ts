import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport'
import { API_URL } from '../../utils/constants'
import { GetAllUsersRequest } from '../generated/user'
import { UserServiceClient } from '../generated/user.client'
import { callWithAuth } from './grpc-client-wrapper'

const transport = new GrpcWebFetchTransport({
	baseUrl: API_URL,
})

export const userClient = new UserServiceClient(transport)

export async function grpcGetAllUsers() {
	const request = GetAllUsersRequest.create()
	return callWithAuth(userClient.getAll, request, userClient)
}
