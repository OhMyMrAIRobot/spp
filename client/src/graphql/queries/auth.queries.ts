import { gql } from '@apollo/client'

export const LOGIN_MUTATION = gql`
	mutation Login($input: LoginInput!) {
		login(input: $input) {
			token
			user {
				id
				username
				role
			}
		}
	}
`

export const REGISTER_MUTATION = gql`
	mutation Register($input: RegisterInput!) {
		register(input: $input) {
			token
			user {
				id
				username
				role
			}
		}
	}
`

export const REFRESH_MUTATION = gql`
	mutation Refresh {
		refresh {
			token
			user {
				id
				username
				role
			}
		}
	}
`

export const LOGOUT_MUTATION = gql`
	mutation Logout {
		logout
	}
`
