import { configureStore } from '@reduxjs/toolkit'
import { authListener } from './middlewares/auth-listener'
import { attachmentApi } from './services/attachment-api-service'
import { projectApi } from './services/project-api-service'
import { taskApi } from './services/task-api-service'
import { userApi } from './services/user-api-service'
import authReducer from './slices/auth.slice'

export const store = configureStore({
	reducer: {
		auth: authReducer,
		[taskApi.reducerPath]: taskApi.reducer,
		[projectApi.reducerPath]: projectApi.reducer,
		[userApi.reducerPath]: userApi.reducer,
		[attachmentApi.reducerPath]: attachmentApi.reducer,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat(
			taskApi.middleware,
			projectApi.middleware,
			userApi.middleware,
			attachmentApi.middleware,
			authListener.middleware
		),
	devTools: true,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
