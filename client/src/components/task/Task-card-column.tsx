import type { FC } from 'react'
import type { ITask } from '../../types/tasks/task'
import SkeletonLoader from '../loaders/Skeleton-loader'
import TaskCard from './Task-card'

interface IProps {
	title: string
	tasks: ITask[]
	onEditModal: (task: ITask) => void
	isLoading: boolean
}

const TaskCardColumn: FC<IProps> = ({
	title,
	tasks,
	onEditModal,
	isLoading,
}) => {
	return (
		<div className='grid grid-cols-1 bg-black/5 rounded-xl gap-y-3 p-3 h-fit'>
			<div className='rounded-lg flex items-center gap-x-2 bg-white px-4 py-4 border border-black/5'>
				<h6 className='font-medium'>{title}</h6>
				{isLoading ? (
					<SkeletonLoader className={'w-20 h-5 rounded-xl'} />
				) : (
					<span className='text-sm font-medium bg-black/5 rounded-full px-2 py-0.5'>
						{tasks.length} Tasks
					</span>
				)}
			</div>

			{isLoading
				? Array.from({ length: 3 }).map((_, idx) => (
						<TaskCard key={`Task-card-skeleton-${idx}`} isLoading={true} />
				  ))
				: tasks.map(task => (
						<TaskCard
							key={task.id}
							task={task}
							onEditModal={onEditModal}
							isLoading={false}
						/>
				  ))}
		</div>
	)
}

export default TaskCardColumn
