/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	ApolloClient,
	ApolloLink,
	HttpLink,
	InMemoryCache,
	Observable,
	type FetchResult,
} from '@apollo/client'
import { REFRESH_MUTATION } from './queries/auth.queries'
import type { RefreshMutationResponse } from './responses/auth.responses'

const API_URL = import.meta.env.VITE_API_URL

let isRefreshing = false
let pendingRequests: Array<() => void> = []

const resolvePendingRequests = () => {
	pendingRequests.forEach(callback => callback())
	pendingRequests = []
}

const httpLink = new HttpLink({
	uri: `${API_URL}/graphql`,
	credentials: 'include',
})

const authLink = new ApolloLink((operation, forward) => {
	const token = localStorage.getItem('token')

	operation.setContext(
		({ headers = {} }: { headers?: Record<string, string> }) => ({
			headers: {
				...headers,
				authorization: token ? `Bearer ${token}` : '',
			},
		})
	)

	return forward(operation)
})

export const apolloClient = new ApolloClient({
	cache: new InMemoryCache({
		typePolicies: {
			Query: {
				fields: {
					projects: {
						merge(_existing, incoming) {
							return incoming
						},
					},
					project: {
						read(existing, { args, toReference }) {
							if (existing) return existing
							return toReference({
								__typename: 'Project',
								id: args?.id,
							})
						},
					},
					tasksByProject: {
						keyArgs: ['projectId'],
						merge(_existing, incoming) {
							return incoming
						},
					},
					attachmentsByTask: {
						keyArgs: ['taskId'],
						merge(_existing, incoming) {
							return incoming
						},
					},
					users: {
						merge(_existing, incoming) {
							return incoming
						},
					},
				},
			},
		},
	}),
	defaultOptions: {
		watchQuery: {
			fetchPolicy: 'cache-first',
			errorPolicy: 'none',
		},
		query: {
			fetchPolicy: 'cache-first',
			errorPolicy: 'none',
		},
		mutate: {
			errorPolicy: 'none',
		},
	},
	link: ApolloLink.from([]),
})

const errorLink = new ApolloLink((operation, forward) => {
	return new Observable<FetchResult>(observer => {
		let subscription: any = null
		let hasUnauthenticatedError = false

		const executeOperation = () => {
			subscription = forward(operation).subscribe({
				next: result => {
					const errors = result.errors

					if (errors) {
						const isUnauthenticated = errors.some(
							err => err.extensions?.code === 'UNAUTHENTICATED'
						)

						if (isUnauthenticated) {
							hasUnauthenticatedError = true

							if (!isRefreshing) {
								isRefreshing = true

								apolloClient
									.mutate<RefreshMutationResponse>({
										mutation: REFRESH_MUTATION,
										fetchPolicy: 'network-only',
									})
									.then(response => {
										const newToken = response.data?.refresh?.token

										if (newToken) {
											localStorage.setItem('token', newToken)
											resolvePendingRequests()
										} else {
											observer.error(new Error('Failed to refresh token'))
										}
									})
									.catch((refreshError: Error) => {
										pendingRequests = []
										localStorage.removeItem('token')
										localStorage.removeItem('username')
										window.location.href = '/login'
										observer.error(refreshError)
									})
									.finally(() => {
										isRefreshing = false
									})
							}

							pendingRequests.push(() => {
								if (subscription) {
									subscription.unsubscribe()
								}

								subscription = forward(operation).subscribe({
									next: retryResult => {
										observer.next(retryResult)
									},
									error: retryError => {
										observer.error(retryError)
									},
									complete: () => {
										observer.complete()
									},
								})
							})

							return
						}
					}

					observer.next(result)
				},
				error: (error: Error) => {
					observer.error(error)
				},
				complete: () => {
					if (!hasUnauthenticatedError) {
						observer.complete()
					}
				},
			})
		}

		executeOperation()

		return () => {
			if (subscription) {
				subscription.unsubscribe()
			}
		}
	})
})

apolloClient.setLink(ApolloLink.from([errorLink, authLink, httpLink]))
