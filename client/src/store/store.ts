import { configureStore } from '@reduxjs/toolkit'
import { projectApi } from './services/project-api-service'
import { taskApi } from './services/task-api-service'

export const store = configureStore({
	reducer: {
		[taskApi.reducerPath]: taskApi.reducer,
		[projectApi.reducerPath]: projectApi.reducer,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat(taskApi.middleware, projectApi.middleware),
	devTools: true,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
