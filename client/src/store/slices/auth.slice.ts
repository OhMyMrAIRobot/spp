import {
	createAsyncThunk,
	createSlice,
	type PayloadAction,
} from '@reduxjs/toolkit'

import { apolloClient } from '../../graphql/apollo-client'
import {
	LOGIN_MUTATION,
	LOGOUT_MUTATION,
	REFRESH_MUTATION,
	REGISTER_MUTATION,
} from '../../graphql/queries/auth.queries'
import type {
	LoginMutationResponse,
	LogoutMutationResponse,
	RefreshMutationResponse,
	RegisterMutationResponse,
} from '../../graphql/responses/auth.responses'
import {
	extractApolloErrors,
	type FormattedError,
} from '../../graphql/utils/apollo-error-handler'
import type { IAuthResponse } from '../../types/auth/auth-response'
import type { ILoginData } from '../../types/auth/login-data'
import type { IRegisterData } from '../../types/auth/register-data'
import type { IAuthState } from '../types'

const token = localStorage.getItem('token')

const initialState: IAuthState = {
	token: token,
	user: null,
	loading: false,
	globalLoading: !!token,
	error: null,
}

// Refresh
export const refresh = createAsyncThunk<IAuthResponse, void>(
	'auth/refresh',
	async (_, { rejectWithValue }) => {
		try {
			const { data } = await apolloClient.mutate<RefreshMutationResponse>({
				mutation: REFRESH_MUTATION,
			})

			if (data?.refresh) {
				return data.refresh
			}

			return rejectWithValue({ message: 'No data returned' })
		} catch (err: unknown) {
			return rejectWithValue(extractApolloErrors(err))
		}
	}
)

// Login
export const login = createAsyncThunk<IAuthResponse, ILoginData>(
	'auth/login',
	async (credentials, { rejectWithValue }) => {
		try {
			const { data } = await apolloClient.mutate<LoginMutationResponse>({
				mutation: LOGIN_MUTATION,
				variables: { input: credentials },
			})

			if (data?.login) {
				return data.login
			}

			return rejectWithValue({ message: 'Login failed1' })
		} catch (err: unknown) {
			return rejectWithValue(extractApolloErrors(err))
		}
	}
)

// Register
export const register = createAsyncThunk<IAuthResponse, IRegisterData>(
	'auth/register',
	async (credentials, { rejectWithValue }) => {
		try {
			const { data } = await apolloClient.mutate<RegisterMutationResponse>({
				mutation: REGISTER_MUTATION,
				variables: { input: credentials },
			})

			if (data?.register) {
				return data.register
			}

			return rejectWithValue({ message: 'Registration failed' })
		} catch (err: unknown) {
			return rejectWithValue(extractApolloErrors(err))
		}
	}
)

// Logout
export const logout = createAsyncThunk<void, void>(
	'auth/logout',
	async (_, { rejectWithValue }) => {
		try {
			await apolloClient.mutate<LogoutMutationResponse>({
				mutation: LOGOUT_MUTATION,
			})

			await apolloClient.clearStore()
		} catch (err: unknown) {
			return rejectWithValue(extractApolloErrors(err))
		}
	}
)

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		clearError(state) {
			state.error = null
		},
	},
	extraReducers: builder => {
		// Refresh
		builder.addCase(refresh.pending, state => {
			state.globalLoading = true
			state.error = null
		})
		builder.addCase(
			refresh.fulfilled,
			(state, action: PayloadAction<IAuthResponse>) => {
				state.globalLoading = false
				state.token = action.payload.token
				state.user = action.payload.user
				localStorage.setItem('token', action.payload.token)
				localStorage.setItem('username', action.payload.user.username)
			}
		)
		builder.addCase(refresh.rejected, (state, action) => {
			state.globalLoading = false
			state.error = action.payload as FormattedError
			state.token = null
			state.user = null
			localStorage.removeItem('token')
			localStorage.removeItem('username')
		})

		// Login
		builder.addCase(login.pending, state => {
			state.loading = true
			state.error = null
		})
		builder.addCase(
			login.fulfilled,
			(state, action: PayloadAction<IAuthResponse>) => {
				state.loading = false
				state.token = action.payload.token
				state.user = action.payload.user
				localStorage.setItem('token', action.payload.token)
				localStorage.setItem('username', action.payload.user.username)
			}
		)
		builder.addCase(login.rejected, (state, action) => {
			state.loading = false
			state.error = action.payload as FormattedError
		})

		// Register
		builder.addCase(register.pending, state => {
			state.loading = true
			state.error = null
		})
		builder.addCase(
			register.fulfilled,
			(state, action: PayloadAction<IAuthResponse>) => {
				state.loading = false
				state.token = action.payload.token
				state.user = action.payload.user
				localStorage.setItem('token', action.payload.token)
				localStorage.setItem('username', action.payload.user.username)
			}
		)
		builder.addCase(register.rejected, (state, action) => {
			state.loading = false
			state.error = action.payload as FormattedError
		})

		// Logout
		builder.addCase(logout.pending, state => {
			state.loading = true
			state.error = null
		})
		builder.addCase(logout.fulfilled, state => {
			state.loading = false
			state.token = null
			state.user = null
			localStorage.removeItem('token')
			localStorage.removeItem('username')
		})
		builder.addCase(logout.rejected, (state, action) => {
			state.loading = false
			state.error = action.payload as FormattedError
		})
	},
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
