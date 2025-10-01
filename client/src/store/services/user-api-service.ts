// store/services/user-api-service.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { ApiResponse } from '../../types/api-response'
import type { IUser } from '../../types/user/user'

const SERVER_URL = import.meta.env.VITE_API_URL

export const userApi = createApi({
	reducerPath: 'UserApi',
	baseQuery: fetchBaseQuery({
		baseUrl: SERVER_URL,
		prepareHeaders: headers => {
			const token = localStorage.getItem('token')
			if (token) headers.set('Authorization', `Bearer ${token}`)
			return headers
		},
	}),
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
