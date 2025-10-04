/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	createAsyncThunk,
	createSlice,
	type PayloadAction,
} from '@reduxjs/toolkit'
import type { ApiResponse } from '../../types/api/api-response'
import type { IAuthResponse } from '../../types/auth/auth-response'
import type { ILoginData } from '../../types/auth/login-data'
import type { IRegisterData } from '../../types/auth/register-data'
import { loginApi, logoutApi, refreshApi, registerApi } from '../api/auth-api'
import type { AuthState } from '../types'

const token = localStorage.getItem('token')

const initialState: AuthState = {
	token: token,
	user: null,
	loading: false,
	globalLoading: !!token,
	error: null,
}

// refresh
export const refresh = createAsyncThunk<IAuthResponse, void>(
	'auth/refresh',
	async (_, { rejectWithValue }) => {
		try {
			const response = await refreshApi()
			if (response.data.data) {
				return response.data.data
			}
			return rejectWithValue(response.data)
		} catch (err: any) {
			return rejectWithValue(err.response?.data || { message: 'Unauthorized!' })
		}
	}
)

// login
export const login = createAsyncThunk<IAuthResponse, ILoginData>(
	'auth/login',
	async (credentials, { rejectWithValue }) => {
		try {
			const response = await loginApi(credentials)
			if (response.data.data) {
				return response.data.data
			}
			return rejectWithValue(response.data)
		} catch (err: any) {
			return rejectWithValue(
				err.response?.data || { message: 'Sign in error!' }
			)
		}
	}
)

// register
export const register = createAsyncThunk<IAuthResponse, IRegisterData>(
	'auth/register',
	async (data, { rejectWithValue }) => {
		try {
			const response = await registerApi(data)
			if (response.data.data) {
				return response.data.data
			}

			return rejectWithValue(response.data)
		} catch (err: any) {
			return rejectWithValue(
				err.response?.data || { message: 'Sign up error!' }
			)
		}
	}
)

// logout
export const logout = createAsyncThunk(
	'auth/logout',
	async (_, { rejectWithValue }) => {
		try {
			const response = await logoutApi()
			if (response.status === 204) {
				return
			}

			return rejectWithValue(response.data)
		} catch (err: any) {
			return rejectWithValue(err.response?.data || { message: 'Logout error!' })
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
		// logout
		builder.addCase(logout.pending, state => {
			state.globalLoading = false
			state.loading = true
			state.error = null
		})
		builder.addCase(logout.fulfilled, state => {
			state.globalLoading = false
			state.loading = false
			state.token = null
			state.user = null
			localStorage.removeItem('token')
			localStorage.removeItem('username')
		})
		builder.addCase(logout.rejected, (state, action) => {
			state.globalLoading = false
			state.loading = false
			state.error = action.payload as ApiResponse<null> | null
		})

		// refresh
		builder.addCase(refresh.pending, state => {
			state.globalLoading = true
			state.loading = false
			state.error = null
		})
		builder.addCase(
			refresh.fulfilled,
			(state, action: PayloadAction<IAuthResponse>) => {
				state.loading = false
				state.globalLoading = false
				state.token = action.payload.token
				state.user = action.payload.user
				localStorage.setItem('token', action.payload.token)
				localStorage.setItem('username', action.payload.user.username)
			}
		)
		builder.addCase(refresh.rejected, (state, action) => {
			state.globalLoading = false
			state.loading = false
			state.error = action.payload as ApiResponse<null> | null
			state.token = null
			state.user = null
			localStorage.removeItem('token')
			localStorage.removeItem('username')
		})

		// login
		builder.addCase(login.pending, state => {
			state.globalLoading = false
			state.loading = true
			state.error = null
		})
		builder.addCase(
			login.fulfilled,
			(state, action: PayloadAction<IAuthResponse>) => {
				state.globalLoading = false
				state.loading = false
				state.token = action.payload.token
				state.user = action.payload.user
				localStorage.setItem('token', action.payload.token)
				localStorage.setItem('username', action.payload.user.username)
			}
		)
		builder.addCase(login.rejected, (state, action) => {
			state.globalLoading = false
			state.loading = false
			state.error = action.payload as ApiResponse<null> | null
		})

		// register
		builder.addCase(register.pending, state => {
			state.globalLoading = false
			state.loading = true
			state.error = null
		})
		builder.addCase(
			register.fulfilled,
			(state, action: PayloadAction<IAuthResponse>) => {
				state.globalLoading = false
				state.loading = false
				state.token = action.payload.token
				state.user = action.payload.user
				localStorage.setItem('token', action.payload.token)
				localStorage.setItem('username', action.payload.user.username)
			}
		)
		builder.addCase(register.rejected, (state, action) => {
			state.globalLoading = false
			state.loading = false
			state.error = action.payload as ApiResponse<null> | null
		})
	},
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
