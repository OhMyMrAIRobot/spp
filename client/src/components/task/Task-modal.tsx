import { useCallback, useEffect, useMemo, useState, type FC } from 'react'
import {
	useCreateTaskMutation,
	useUpdateTaskMutation,
} from '../../store/services/task-api-service'
import type { ITask } from '../../types/tasks/task'
import { TaskStatusEnum } from '../../types/tasks/task-status/task-status-enum'
import FormButton from '../buttons/Form-button'
import Combobox from '../inputs/Combobox'
import FormInput from '../inputs/Form-input'
import FormTextbox from '../inputs/Form-textbox'
import FormLabel from '../labels/Form-label'
import ModalOverlay from '../modal/Modal-overlay'

interface IProps {
	projectId: string
	isOpen: boolean
	onClose: () => void
	task: ITask | null
}

const TaskModal: FC<IProps> = ({ isOpen, onClose, projectId, task }) => {
	const [title, setTitle] = useState('')
	const [desc, setDesc] = useState('')
	const [assignee, setAssignee] = useState('')
	const [date, setDate] = useState<string | null>(null)
	const [status, setStatus] = useState<TaskStatusEnum>(TaskStatusEnum.TODO)

	const [createTask, { isLoading: isCreating }] = useCreateTaskMutation()
	const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation()

	const resetForm = useCallback(() => {
		setTitle(task?.title ?? '')
		setDesc(task?.description ?? '')
		setAssignee(task?.assignee ?? '')
		setDate(task?.dueDate ?? null)
		setStatus(task?.status ?? TaskStatusEnum.TODO)
	}, [task])

	useEffect(() => {
		if (isOpen) resetForm()
	}, [isOpen, resetForm])

	const handleDateChange = (value: string) => {
		setDate(value ? new Date(value).toISOString() : null)
	}

	const isFormValid = useMemo(() => {
		return title.trim() && desc.trim() && assignee.trim() && status
	}, [title, desc, assignee, status])

	const hasChanges = useMemo(() => {
		if (!task) return true
		return (
			title.trim() !== task.title.trim() ||
			desc.trim() !== task.description.trim() ||
			assignee.trim() !== task.assignee.trim() ||
			date !== task.dueDate ||
			status !== task.status
		)
	}, [assignee, date, desc, status, task, title])

	const handleSubmit = async () => {
		if (!isFormValid || !hasChanges) return

		try {
			if (task) {
				const changes: Partial<ITask> = {}

				if (title.trim() !== task.title.trim()) changes.title = title.trim()
				if (desc.trim() !== task.description.trim())
					changes.description = desc.trim()
				if (assignee.trim() !== task.assignee.trim())
					changes.assignee = assignee.trim()
				if (date !== task.dueDate) changes.dueDate = date ?? undefined
				if (status !== task.status) changes.status = status

				updateTask({
					id: task.id,
					projectId,
					changes,
				}).unwrap()
			} else {
				createTask({
					title: title.trim(),
					description: desc.trim(),
					assignee: assignee.trim(),
					dueDate: date ?? undefined,
					status,
					projectId,
				}).unwrap()
			}

			onClose()
		} catch {
			/* empty */
		}
	}

	return (
		<ModalOverlay isOpen={isOpen} onCancel={onClose}>
			<div className='bg-white rounded-xl p-6 w-[450px]'>
				<div className='flex items-center justify-between mb-4'>
					<h3 className='text-lg font-semibold'>
						{task ? 'Edit Task' : 'Add New Task'}
					</h3>
					<button
						onClick={onClose}
						className='text-black/50 hover:text-black/70'
					>
						✕
					</button>
				</div>

				<div className='space-y-4'>
					<div>
						<FormLabel
							title={'Task'}
							htmlFor={'add-task-title-input'}
							isRequired={true}
						/>
						<FormInput
							value={title}
							setValue={setTitle}
							placeholder={'Enter task title'}
							id={'add-task-title-input'}
							type={'text'}
						/>
					</div>

					<div>
						<FormLabel
							title={'Description'}
							htmlFor={'add-task-description-input'}
							isRequired={true}
						/>
						<FormTextbox
							id={'add-task-description-input'}
							value={desc}
							setValue={setDesc}
							rows={3}
							placeholder='Enter task description'
						/>
					</div>

					<div>
						<FormLabel
							title={'Assignee'}
							htmlFor={'add-task-assignee-input'}
							isRequired={true}
						/>
						<FormInput
							id={'add-task-assignee-input'}
							value={assignee}
							setValue={setAssignee}
							placeholder='Enter assignee'
							type='text'
						/>
					</div>

					<div>
						<FormLabel
							title={'Due date'}
							htmlFor={'add-task-due-date-input'}
							isRequired={false}
						/>
						<FormInput
							id='add-task-due-date-input'
							type='date'
							value={date ? date.split('T')[0] : ''}
							setValue={value => handleDateChange(value as string)}
						/>
					</div>

					<div>
						<FormLabel title={'Task status'} isRequired={true} />
						<Combobox
							options={Object.values(TaskStatusEnum)}
							value={status}
							onChange={value => setStatus(value as TaskStatusEnum)}
							className='w-full'
						/>
					</div>

					<div className='flex gap-3 pt-4'>
						<FormButton onClick={onClose} title={'Cancel'} invert={true} />
						<FormButton
							onClick={handleSubmit}
							title={`${task ? 'Edit' : 'Add'} task`}
							disabled={!isFormValid || !hasChanges || isCreating || isUpdating}
						/>
					</div>
				</div>
			</div>
		</ModalOverlay>
	)
}

export default TaskModal
