import { createApi } from '@reduxjs/toolkit/query/react'
import { grpcGetAllUsers } from '../../grpc/clients/user-client'
import { mapUserFromGrpc } from '../../grpc/mappers/user.mapper'
import { extractGrpcError } from '../../grpc/utils/extract-grpc-error'
import type { IUser } from '../../types/users/user'

export const userApi = createApi({
	reducerPath: 'UserApi',
	baseQuery: async () => ({ data: undefined }),
	tagTypes: ['Users'],
	endpoints: builder => ({
		getUsers: builder.query<IUser[], void>({
			queryFn: async () => {
				try {
					const data = await grpcGetAllUsers()
					return { data: data.users.map(u => mapUserFromGrpc(u)) }
				} catch (err) {
					return { error: extractGrpcError(err, 'Failed to fetch users') }
				}
			},
		}),
	}),
})

export const { useGetUsersQuery } = userApi
