import { createSelector } from '@reduxjs/toolkit'
import { tasksAdapter } from '../slices/tasks-slice'
import type { RootState } from '../store'

export const tasksSelectors = tasksAdapter.getSelectors<RootState>(
	state => state.tasks
)

export const selectTasksByProjectId = createSelector(
	[
		(state: RootState) => tasksSelectors.selectAll(state),
		(_: RootState, projectId: string) => projectId,
	],
	(tasks, projectId) => tasks.filter(task => task.projectId === projectId)
)
