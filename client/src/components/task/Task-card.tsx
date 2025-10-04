import { useRef, useState, type ChangeEvent, type FC } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import AttachmentSvg from '../../assets/svg/Attachment-svg'
import CalendarSvg from '../../assets/svg/Calendar-svg'
import DeleteSvg from '../../assets/svg/Delete-svg'
import EditSvg from '../../assets/svg/Edit-svg'
import UserTickSvg from '../../assets/svg/User-tick-svg'
import { useUploadToTaskMutation } from '../../store/services/attachment-api-service'
import { useDeleteTaskMutation } from '../../store/services/task-api-service'
import type { RootState } from '../../store/store'
import type { ITask } from '../../types/tasks/task'
import type { ITaskExtended } from '../../types/tasks/task-extended'
import { UserRoleEnum } from '../../types/users/user-role-enum'
import { dateUtils } from '../../utils/date-util'
import { getApiErrorMessages } from '../../utils/get-api-error-messages'
import Loader from '../loaders/Loader'
import SkeletonLoader from '../loaders/Skeleton-loader'
import ConfirmationModal from '../modal/Confirmation-modal'
import TaskAttachment from './Task-attachment'

interface IProps {
	task?: ITaskExtended
	onEditModal?: (task: ITask) => void
	isLoading: boolean
}

const TaskCard: FC<IProps> = ({ task, onEditModal, isLoading }) => {
	const { user } = useSelector((state: RootState) => state.auth)

	const [modalOpen, setModalOpen] = useState<boolean>(false)
	const [deleteTask] = useDeleteTaskMutation()

	const [uploadToTask, { isLoading: uploading }] = useUploadToTaskMutation()
	const fileInputRef = useRef<HTMLInputElement | null>(null)

	if (!task || isLoading)
		return <SkeletonLoader className={'w-full h-40 rounded-lg'} />

	const handleDelete = async () => {
		try {
			await deleteTask({ id: task.id, projectId: task.projectId }).unwrap()
		} finally {
			setModalOpen(false)
		}
	}

	const handleOpenFileDialog = () => {
		fileInputRef.current?.click()
	}

	const handleFilesSelected = async (e: ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files ?? [])
		e.target.value = ''
		if (!files.length) return

		try {
			await uploadToTask({
				taskId: task.id,
				projectId: task.projectId,
				files,
			}).unwrap()
			toast.success(
				`Attachment${files.length > 1 ? 's' : ''} added successfully!`
			)
		} catch (err) {
			const messages = getApiErrorMessages(err)
			if (messages.length) {
				messages.forEach(m => toast.error(m))
			} else {
				toast.error('Something went wrong')
			}
		}
	}

	const canEdit = user?.role === UserRoleEnum.ADMIN || user?.id === task.user.id

	return (
		<>
			<ConfirmationModal
				title={'Delete task?'}
				isOpen={modalOpen}
				onConfirm={handleDelete}
				onCancel={() => setModalOpen(false)}
			/>

			<div
				className={`border relative border-black/10 rounded-lg bg-white hover:bg-black/[0.01] overflow-hidden ${
					task.id.startsWith('temp') ? 'opacity-60 pointer-events-none' : ''
				}`}
			>
				<div className='flex flex-col px-3 py-1.5'>
					<h6 className='font-medium pb-1 break-words'>{task.title}</h6>
					<p className='font-light text-sm pb-2'>{task.description}</p>

					<div className='text-sm flex items-center gap-x-1 mb-2'>
						<UserTickSvg className='size-5' />
						<span className='font-medium'>{task.user.username}</span>
					</div>

					{task.dueDate && (
						<div className='text-black/50 text-sm font-medium flex items-center gap-x-1 border-black/10'>
							<CalendarSvg className='size-5' />
							Due Date: {dateUtils.format(task.dueDate)}
						</div>
					)}

					{canEdit && (
						<div className='-ml-2 flex gap-0.5 z-100 mt-1'>
							<button
								onClick={handleOpenFileDialog}
								className={`p-2 rounded hover:bg-black/10 transition-colors duration-200 disabled:opacity-60 ${
									uploading ? 'opacity-50 pointer-events-none' : ''
								}`}
								title='Add attachment'
								disabled={uploading}
							>
								{uploading ? (
									<Loader className='size-5 border-black' />
								) : (
									<AttachmentSvg className={'size-5 stroke-black'} />
								)}
							</button>

							<button
								onClick={() => onEditModal?.(task)}
								className='p-2 rounded hover:bg-black/10 transition-colors duration-200'
								title='Edit Task'
							>
								<EditSvg className={'size-5 stroke-black'} />
							</button>

							<button
								onClick={() => setModalOpen(true)}
								className='p-2 rounded hover:bg-red-100 transition-colors duration-200'
								title='Delete Task'
							>
								<DeleteSvg className={'size-5 stroke-black'} />
							</button>

							<input
								ref={fileInputRef}
								type='file'
								multiple
								className='hidden'
								onChange={handleFilesSelected}
								accept='.png,.jpeg,.webp,.pdf,.txt,.zip'
							/>
						</div>
					)}
				</div>

				{task.attachments.length > 0 && (
					<div className='border-t flex px-2 py-1 gap-1 flex-wrap'>
						{task.attachments.map(att => (
							<TaskAttachment
								key={att.id}
								attachment={att}
								taskId={task.id}
								projectId={task.projectId}
							/>
						))}
					</div>
				)}
			</div>
		</>
	)
}

export default TaskCard
