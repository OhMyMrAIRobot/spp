import type { FC } from 'react'
import type { ITask } from '../../types/tasks/task'
import TaskCard from './Task-card'

interface IProps {
	title: string
	tasks: ITask[]
}

const TaskCardColumn: FC<IProps> = ({ title, tasks }) => {
	return (
		<div className='grid grid-cols-1 bg-black/5 rounded-xl gap-y-3 p-3 h-fit'>
			<div className='rounded-lg flex items-center gap-x-2 bg-white px-4 py-4 border border-black/5'>
				<h6 className='font-medium'>{title}</h6>
				<span className='text-sm font-medium bg-black/5 rounded-full px-2 py-0.5'>
					{tasks.length} Tasks
				</span>
			</div>

			{tasks.map(task => (
				<TaskCard key={task.id} task={task} />
			))}
		</div>
	)
}

export default TaskCardColumn
