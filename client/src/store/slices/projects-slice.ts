import {
	createEntityAdapter,
	createSlice,
	type PayloadAction,
} from '@reduxjs/toolkit'
import type { IProject } from '../../types/projects/project'
import { generateId } from '../../utils/generate-id'

export const projectsAdapter = createEntityAdapter<IProject>()

const projectsSlice = createSlice({
	name: 'projects',
	initialState: projectsAdapter.getInitialState(),
	reducers: {
		addProject: {
			reducer: (state, action: PayloadAction<IProject>) => {
				projectsAdapter.addOne(state, action.payload)
			},
			prepare: (data: Omit<IProject, 'id' | 'createdAt' | 'taskIds'>) => {
				const id = generateId()
				const createdAt = new Date().toISOString()
				const taskIds: string[] = []
				return {
					payload: { id, createdAt, taskIds, ...data } as IProject,
				}
			},
		},

		addTaskIdToProject: (
			state,
			action: PayloadAction<{ projectId: string; taskId: string }>
		) => {
			const project = state.entities[action.payload.projectId]
			if (project && !project.taskIds.includes(action.payload.taskId)) {
				project.taskIds.push(action.payload.taskId)
			}
		},

		removeTaskIdFromProject: (
			state,
			action: PayloadAction<{ projectId: string; taskId: string }>
		) => {
			const project = state.entities[action.payload.projectId]
			if (project)
				project.taskIds = project.taskIds.filter(
					id => id !== action.payload.taskId
				)
		},
	},
})

export const { addProject, addTaskIdToProject, removeTaskIdFromProject } =
	projectsSlice.actions

export default projectsSlice.reducer
