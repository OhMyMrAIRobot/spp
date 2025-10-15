import { useCallback, useEffect, useMemo, useState, type FC } from 'react'
import toast from 'react-hot-toast'
import { useCreateTask, useUpdateTask } from '../../graphql/hooks/use-tasks'
import { extractApolloErrors } from '../../graphql/utils/apollo-error-handler'
import type { CreateTaskData } from '../../types/tasks/create-task-data'
import type { ITask } from '../../types/tasks/task'
import { TaskStatusEnum } from '../../types/tasks/task-status-enum'
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
	const [title, setTitle] = useState<string>('')
	const [desc, setDesc] = useState<string>('')
	const [date, setDate] = useState<string | null>(null)
	const [status, setStatus] = useState<TaskStatusEnum>(TaskStatusEnum.TODO)

	const [internalIsOpen, setInternalIsOpen] = useState(false)

	const [errorFormData, setErrorFormData] = useState<CreateTaskData | null>(
		null
	)
	const [isRestoredFromError, setIsRestoredFromError] = useState(false)

	const { createTask, loading: isCreating } = useCreateTask()
	const { updateTask, loading: isUpdating } = useUpdateTask()

	useEffect(() => {
		setInternalIsOpen(isOpen)
	}, [isOpen])

	const resetForm = useCallback(() => {
		if (errorFormData && !isRestoredFromError) {
			setTitle(errorFormData.title)
			setDesc(errorFormData.description)
			setDate(errorFormData.dueDate ?? null)
			setStatus(errorFormData.status)
			setIsRestoredFromError(true)
		} else if (task && !errorFormData) {
			setTitle(task.title ?? '')
			setDesc(task.description ?? '')
			setDate(task.dueDate ?? null)
			setStatus(task.status ?? TaskStatusEnum.TODO)
		} else if (!task && !errorFormData) {
			setTitle('')
			setDesc('')
			setDate(null)
			setStatus(TaskStatusEnum.TODO)
		}
	}, [task, errorFormData, isRestoredFromError])

	useEffect(() => {
		if (internalIsOpen) {
			resetForm()
		} else {
			if (!errorFormData) {
				setIsRestoredFromError(false)
			}
		}
	}, [internalIsOpen, resetForm, errorFormData])

	const handleDateChange = (value: string) => {
		setDate(value || null)
	}

	const isFormValid = useMemo(() => {
		return title.trim() && desc.trim() && status
	}, [title, desc, status])

	const hasChanges = useMemo(() => {
		if (!task) return true
		return (
			title.trim() !== task.title.trim() ||
			desc.trim() !== task.description.trim() ||
			date !== task.dueDate ||
			status !== task.status
		)
	}, [date, desc, status, task, title])

	const handleClose = () => {
		setInternalIsOpen(false)
		setErrorFormData(null)
		setIsRestoredFromError(false)
		onClose()
	}

	const handleSubmit = () => {
		if (!isFormValid || !hasChanges) return

		const data: CreateTaskData = {
			title: title.trim(),
			description: desc.trim(),
			dueDate: date ?? undefined,
			status,
			projectId,
		}

		setInternalIsOpen(false)
		setIsRestoredFromError(false)
		onClose()

		let promise

		if (task) {
			const changes: Partial<ITask> = {}

			if (title.trim() !== task.title.trim()) changes.title = title.trim()
			if (desc.trim() !== task.description.trim())
				changes.description = desc.trim()
			if (date !== task.dueDate) changes.dueDate = date ?? undefined
			if (status !== task.status) changes.status = status

			promise = updateTask(task.id, projectId, changes)
		} else {
			promise = createTask(data)
		}

		promise
			.then(() => {
				toast.success(
					task ? 'Task updated successfully' : 'Task created successfully'
				)
				setErrorFormData(null)
			})
			.catch(err => {
				const formattedError = extractApolloErrors(err)

				if (
					formattedError.validationErrors &&
					formattedError.validationErrors.length > 0
				) {
					formattedError.validationErrors.forEach(validationErr => {
						toast.error(`${validationErr.field}: ${validationErr.message}`)
					})
				} else {
					toast.error(formattedError.message)
				}

				setErrorFormData(data)

				setTimeout(() => {
					setInternalIsOpen(true)
					setIsRestoredFromError(false)
				}, 300)
			})
	}

	const isLoading = isCreating || isUpdating

	return (
		<ModalOverlay isOpen={internalIsOpen} onCancel={handleClose}>
			<div className='bg-white rounded-xl p-6 w-[450px]'>
				<div className='flex items-center justify-between mb-4'>
					<h3 className='text-lg font-semibold'>
						{task ? 'Edit Task' : 'Add New Task'}
					</h3>
					<button
						onClick={handleClose}
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
						<FormButton onClick={handleClose} title={'Cancel'} invert={true} />
						<FormButton
							onClick={handleSubmit}
							title={`${task ? 'Edit' : 'Add'} task`}
							disabled={!isFormValid || !hasChanges || isLoading}
							isLoading={isLoading}
						/>
					</div>
				</div>
			</div>
		</ModalOverlay>
	)
}

export default TaskModal
