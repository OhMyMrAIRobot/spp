/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GraphQLError } from 'graphql'

export interface ServerValidationError {
	path: string
	message: string
}

export interface ValidationError {
	field: string
	message: string
}

export interface FormattedError {
	message: string
	validationErrors?: ValidationError[]
}

export const extractApolloErrors = (error: unknown): FormattedError => {
	if (error && typeof error === 'object') {
		const graphQLErrors = (error as any).errors as
			| readonly GraphQLError[]
			| undefined

		if (
			graphQLErrors &&
			Array.isArray(graphQLErrors) &&
			graphQLErrors.length > 0
		) {
			const firstError = graphQLErrors[0]

			const serverErrors = firstError.extensions?.errors as
				| ServerValidationError[]
				| undefined

			if (
				serverErrors &&
				Array.isArray(serverErrors) &&
				serverErrors.length > 0
			) {
				const validationErrors: ValidationError[] = serverErrors.map(err => ({
					field: err.path,
					message: err.message,
				}))

				return {
					message: firstError.message || 'Validation failed',
					validationErrors,
				}
			}

			return {
				message: firstError.message,
			}
		}

		const networkError = (error as any).networkError as Error | undefined
		if (networkError) {
			return {
				message: networkError.message || 'Network error occurred',
			}
		}

		if ('message' in error && typeof (error as any).message === 'string') {
			return {
				message: (error as any).message,
			}
		}
	}

	if (error instanceof Error) {
		return {
			message: error.message,
		}
	}

	if (typeof error === 'string') {
		return {
			message: error,
		}
	}

	return {
		message: 'Unknown error occurred',
	}
}

export const getErrorMessages = (error: unknown): string[] => {
	const formatted = extractApolloErrors(error)

	if (formatted.validationErrors && formatted.validationErrors.length > 0) {
		return formatted.validationErrors.map(err => err.message)
	}

	return [formatted.message]
}

export const showApolloErrors = (
	error: unknown,
	toastFn: (message: string) => void
): void => {
	const messages = getErrorMessages(error)
	messages.forEach(msg => toastFn(msg))
}
