/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	createAsyncThunk,
	createSlice,
	type PayloadAction,
} from '@reduxjs/toolkit'
import type { IAuthResponse } from '../../types/auth/auth-response'
import type { ILoginData } from '../../types/auth/login-data'
import type { IRegisterData } from '../../types/auth/register-data'
import { isAuthApi, loginApi, registerApi } from '../api'
import type { AuthState } from '../types'

const token = localStorage.getItem('token')

const initialState: AuthState = {
	token: token,
	user: null,
	loading: false,
	globalLoading: !!token,
	error: null,
}

// checkAuth
export const checkAuth = createAsyncThunk<IAuthResponse, void>(
	'auth/checkAuth',
	async (_, { rejectWithValue }) => {
		try {
			const response = await isAuthApi()
			if (response.data.data) {
				return response.data.data
			}
			return rejectWithValue(response.data.message || 'Unauthorized!')
		} catch (err: any) {
			return rejectWithValue(err.response?.data?.message || 'Unauthorized!')
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
			return rejectWithValue(response.data.message || 'Sign in error!')
		} catch (err: any) {
			return rejectWithValue(err.response?.data?.message || 'Sign in error!')
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
			return rejectWithValue(response.data.message || 'Sign up error!')
		} catch (err: any) {
			return rejectWithValue(err.response?.data?.message || 'Sign up error!')
		}
	}
)

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logout(state) {
			state.token = null
			state.user = null
			state.globalLoading = false
			state.loading = false
			state.error = null
			localStorage.removeItem('token')
			localStorage.removeItem('username')
		},
	},
	extraReducers: builder => {
		// checkAuth
		builder.addCase(checkAuth.pending, state => {
			state.globalLoading = true
			state.loading = false
			state.error = null
		})
		builder.addCase(
			checkAuth.fulfilled,
			(state, action: PayloadAction<IAuthResponse>) => {
				state.loading = false
				state.globalLoading = false
				state.token = action.payload.token
				state.user = action.payload.user
				localStorage.setItem('token', action.payload.token)
				localStorage.setItem('username', action.payload.user.username)
			}
		)
		builder.addCase(checkAuth.rejected, (state, action) => {
			state.globalLoading = false
			state.loading = false
			state.error = action.payload as string
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
			state.error = action.payload as string
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
			state.error = action.payload as string
		})
	},
})

export const { logout } = authSlice.actions
export default authSlice.reducer
