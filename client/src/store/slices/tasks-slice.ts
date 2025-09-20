import {
	createEntityAdapter,
	createSlice,
	type PayloadAction,
} from '@reduxjs/toolkit'
import type { ITask } from '../../types/tasks/task'
import { generateId } from '../../utils/generate-id'

export const tasksAdapter = createEntityAdapter<ITask>()

const tasksSlice = createSlice({
	name: 'tasks',
	initialState: tasksAdapter.getInitialState(),
	reducers: {
		addTask: {
			reducer: (state, action: PayloadAction<ITask>) => {
				tasksAdapter.addOne(state, action.payload)
			},
			prepare: (data: Omit<ITask, 'id' | 'createdAt'>) => {
				const id = generateId()
				const createdAt = new Date().toISOString()
				return { payload: { id, createdAt, ...data } as ITask }
			},
		},

		updateTask: (
			state,
			action: PayloadAction<{ id: string; changes: Partial<ITask> }>
		) => {
			tasksAdapter.updateOne(state, {
				id: action.payload.id,
				changes: action.payload.changes,
			})
		},

		removeTask: (state, action: PayloadAction<{ id: string }>) => {
			tasksAdapter.removeOne(state, action.payload.id)
		},
	},
})

export const { addTask, updateTask, removeTask } = tasksSlice.actions

export default tasksSlice.reducer
