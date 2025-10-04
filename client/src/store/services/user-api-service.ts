import { createApi } from '@reduxjs/toolkit/query/react'
import type { ApiResponse } from '../../types/api/api-response'
import type { IUser } from '../../types/users/user'
import { axiosBaseQuery } from '../api/axios-base-query'

export const userApi = createApi({
	reducerPath: 'UserApi',
	baseQuery: axiosBaseQuery(),
	tagTypes: ['Users'],
	endpoints: builder => ({
		getUsers: builder.query<IUser[], void>({
			query: () => '/users',
			transformResponse: (response: ApiResponse<IUser[]>) =>
				response.data ?? [],
		}),
	}),
})

export const { useGetUsersQuery } = userApi
