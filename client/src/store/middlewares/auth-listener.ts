import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit'
import { projectApi } from '../services/project-api-service'
import { taskApi } from '../services/task-api-service'
import { userApi } from '../services/user-api-service'
import { login, logout, refresh, register } from '../slices/auth.slice'

export const authListener = createListenerMiddleware()

authListener.startListening({
	matcher: isAnyOf(
		logout.fulfilled,
		login.fulfilled,
		register.fulfilled,
		refresh.rejected
	),
	effect: async (_action, listenerApi) => {
		listenerApi.dispatch(projectApi.util.resetApiState())
		listenerApi.dispatch(taskApi.util.resetApiState())
		listenerApi.dispatch(userApi.util.resetApiState())
	},
})
