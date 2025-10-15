import { useQuery } from '@apollo/client/react'
import { GET_USERS_QUERY } from '../queries/user.queries'
import type { GetUsersQueryResponse } from '../responses/user.responses'

export const useGetUsers = () => {
	const { data, loading, error, refetch } = useQuery<GetUsersQueryResponse>(
		GET_USERS_QUERY,
		{
			fetchPolicy: 'cache-first',
			nextFetchPolicy: 'cache-first',
		}
	)

	return {
		users: data?.users || [],
		loading,
		error,
		refetch,
	}
}
