import { configureStore } from '@reduxjs/toolkit'
import { mockProjects, mockTasks } from '../data'
import { tasksProjectsListener } from './middlewares/tasks-listener'
import projectsReducer, { projectsAdapter } from './slices/projects-slice'
import tasksReducer, { tasksAdapter } from './slices/tasks-slice'

const preloadedState = {
	projects: projectsAdapter.setAll(
		projectsAdapter.getInitialState(),
		mockProjects
	),
	tasks: tasksAdapter.setAll(tasksAdapter.getInitialState(), mockTasks),
}

export const store = configureStore({
	reducer: {
		projects: projectsReducer,
		tasks: tasksReducer,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().prepend(tasksProjectsListener.middleware),
	preloadedState,
	devTools: true,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
