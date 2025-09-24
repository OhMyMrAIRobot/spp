import { useState, type FC } from 'react'
import CalendarSvg from '../../assets/svg/Calendar-svg'
import DeleteSvg from '../../assets/svg/Delete-svg'
import EditSvg from '../../assets/svg/Edit-svg'
import UserTickSvg from '../../assets/svg/User-tick-svg'
import { useDeleteTaskMutation } from '../../store/services/task-api-service'
import type { ITask } from '../../types/tasks/task'
import { dateUtils } from '../../utils/date-util'
import SkeletonLoader from '../loaders/Skeleton-loader'
import ConfirmationModal from '../modal/Confirmation-modal'

interface IProps {
	task?: ITask
	onEditModal?: (task: ITask) => void
	isLoading: boolean
}

const TaskCard: FC<IProps> = ({ task, onEditModal, isLoading }) => {
	const [modalOpen, setModalOpen] = useState<boolean>(false)

	const [deleteTask] = useDeleteTaskMutation()

	if (!task || isLoading)
		return <SkeletonLoader className={'w-full h-40 rounded-lg'} />

	const handleDelete = async () => {
		try {
			await deleteTask({ id: task.id, projectId: task.projectId }).unwrap()
		} finally {
			setModalOpen(false)
		}
	}

	return (
		<>
			<ConfirmationModal
				title={'Delete task?'}
				isOpen={modalOpen}
				onConfirm={handleDelete}
				onCancel={() => setModalOpen(false)}
			/>

			<div
				className={`border border-black/10 rounded-lg bg-white hover:bg-black/[0.01] ${
					task.id.startsWith('temp') ? 'opacity-60 pointer-events-none' : ''
				}`}
			>
				<div className='flex flex-col px-3 py-1.5'>
					<h6 className='font-medium pb-1'>{task.title}</h6>
					<p className='font-light text-sm pb-2'>{task.description}</p>

					<div className='text-sm flex items-center gap-x-1 mb-2'>
						<UserTickSvg className='size-5' />
						<span className='font-medium'>{task.assignee}</span>
					</div>
				</div>

				<div className='border-t flex px-3 py-1'>
					{task.dueDate && (
						<div className='text-black/50 text-sm font-medium flex items-center gap-x-1 border-black/10'>
							<CalendarSvg className='size-4' />
							Due Date: {dateUtils.format(task.dueDate)}
						</div>
					)}

					<div className='flex gap-2 mt-1 ml-auto'>
						<button
							onClick={() => onEditModal?.(task)}
							className='p-2 rounded hover:bg-black/10 transition-colors duration-200'
							title='Edit Task'
						>
							<EditSvg className={'size-5 stroke-black'} />
						</button>

						<button
							onClick={() => setModalOpen(true)}
							className='p-2 rounded hover:bg-red-300 transition-colors duration-200'
							title='Delete Task'
						>
							<DeleteSvg className={'size-5 stroke-black'} />
						</button>
					</div>
				</div>
			</div>
		</>
	)
}

export default TaskCard
