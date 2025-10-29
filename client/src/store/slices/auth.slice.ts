/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	createAsyncThunk,
	createSlice,
	type PayloadAction,
} from '@reduxjs/toolkit'
import {
	grpcLogin,
	grpcLogout,
	grpcRefresh,
	grpcRegister,
} from '../../grpc/clients/auth-client'
import type {
	LoginResponse,
	RefreshResponse,
	RegisterResponse,
} from '../../grpc/generated/auth'
import { mapUserFromGrpc } from '../../grpc/mappers/user.mapper'
import { extractGrpcError } from '../../grpc/utils/extract-grpc-error'
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '../../utils/constants'
import type { AuthState } from '../types'

const refreshToken = localStorage.getItem(REFRESH_TOKEN_NAME)

const initialState: AuthState = {
	user: null,
	loading: false,
	globalLoading: !!refreshToken,
	error: null,
}

// refresh
export const refresh = createAsyncThunk<RefreshResponse, void>(
	'auth/refresh',
	async (_, { rejectWithValue }) => {
		try {
			const response = await grpcRefresh()
			if (response) return response
			return rejectWithValue({ message: 'Unauthorized!' })
		} catch (err) {
			return rejectWithValue(extractGrpcError(err, 'Unauthorized!'))
		}
	}
)

// login
export const login = createAsyncThunk<
	LoginResponse,
	{ username: string; password: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
	try {
		const response = await grpcLogin(credentials.username, credentials.password)
		return response
	} catch (err) {
		return rejectWithValue(extractGrpcError(err, 'Sign in error!'))
	}
})

// register
export const register = createAsyncThunk<
	RegisterResponse,
	{ username: string; password: string }
>('auth/register', async (data, { rejectWithValue }) => {
	try {
		const response = await grpcRegister(data.username, data.password)
		return response
	} catch (err) {
		return rejectWithValue(extractGrpcError(err, 'Sign up error!'))
	}
})

// logout
export const logout = createAsyncThunk(
	'auth/logout',
	async (_, { rejectWithValue }) => {
		try {
			await grpcLogout()
			return
		} catch (err) {
			return rejectWithValue(extractGrpcError(err, 'Logout error!'))
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
		builder
			.addCase(login.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(
				login.fulfilled,
				(state, action: PayloadAction<LoginResponse>) => {
					state.loading = false
					state.user = mapUserFromGrpc(action.payload.user!)
					localStorage.setItem(ACCESS_TOKEN_NAME, action.payload.accessToken)
					localStorage.setItem(REFRESH_TOKEN_NAME, action.payload.refreshToken)
					if (action.payload.user) {
						localStorage.setItem('username', action.payload.user.username)
					}
				}
			)
			.addCase(login.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload as any
			})

			.addCase(register.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(
				register.fulfilled,
				(state, action: PayloadAction<RegisterResponse>) => {
					state.loading = false
					state.user = mapUserFromGrpc(action.payload.user!)
					localStorage.setItem(ACCESS_TOKEN_NAME, action.payload.accessToken)
					localStorage.setItem(REFRESH_TOKEN_NAME, action.payload.refreshToken)
					if (action.payload.user) {
						localStorage.setItem('username', action.payload.user.username)
					}
				}
			)
			.addCase(register.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload as any
			})

			.addCase(refresh.pending, state => {
				state.globalLoading = true
				state.error = null
			})
			.addCase(
				refresh.fulfilled,
				(state, action: PayloadAction<RefreshResponse>) => {
					state.globalLoading = false
					state.user = mapUserFromGrpc(action.payload.user!)
					localStorage.setItem(ACCESS_TOKEN_NAME, action.payload.accessToken)
					localStorage.setItem(REFRESH_TOKEN_NAME, action.payload.refreshToken)
					if (action.payload.user) {
						localStorage.setItem('username', action.payload.user.username)
					}
				}
			)
			.addCase(refresh.rejected, state => {
				state.globalLoading = false
				state.user = null
				localStorage.removeItem(ACCESS_TOKEN_NAME)
				localStorage.removeItem(REFRESH_TOKEN_NAME)
				localStorage.removeItem('username')
			})

			.addCase(logout.fulfilled, state => {
				state.user = null
				localStorage.removeItem(ACCESS_TOKEN_NAME)
				localStorage.removeItem(REFRESH_TOKEN_NAME)
				localStorage.removeItem('username')
			})
	},
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
