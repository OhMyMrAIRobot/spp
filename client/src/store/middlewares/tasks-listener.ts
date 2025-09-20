import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit'
import {
	addTaskIdToProject,
	removeTaskIdFromProject,
} from '../slices/projects-slice'
import { addTask, removeTask } from '../slices/tasks-slice'
import type { RootState } from '../store'

export const tasksProjectsListener = createListenerMiddleware()

tasksProjectsListener.startListening({
	matcher: isAnyOf(addTask, removeTask),
	effect: async (action, listenerApi) => {
		const state = listenerApi.getState() as RootState

		if (addTask.match(action)) {
			const { id, projectId } = action.payload
			listenerApi.dispatch(addTaskIdToProject({ projectId, taskId: id }))
		}

		if (removeTask.match(action)) {
			const task = state.tasks.entities[action.payload.id]
			if (task) {
				listenerApi.dispatch(
					removeTaskIdFromProject({
						projectId: task.projectId,
						taskId: task.id,
					})
				)
			}
		}
	},
})
