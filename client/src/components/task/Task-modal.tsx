import { useEffect, useMemo, useState, type FC } from 'react'
import type { ITask } from '../../types/tasks/task'
import { TaskStatusEnum } from '../../types/tasks/task-status/task-status-enum'
import { generateId } from '../../utils/generate-id'
import FormButton from '../buttons/Form-button'
import Combobox from '../inputs/Combobox'
import FormInput from '../inputs/Form-input'
import FormTextbox from '../inputs/Form-textbox'
import FormLabel from '../labels/Form-label'
import ModalOverlay from '../modal/Modal-overlay'

interface IProps {
	isOpen: boolean
	onClose: () => void
	onAddTask: (task: ITask) => void
}

const TaskModal: FC<IProps> = ({ isOpen, onClose, onAddTask }) => {
	const [title, setTitle] = useState<string>('')
	const [desc, setDesc] = useState<string>('')
	const [assignee, setAssignee] = useState<string>('')
	const [date, setDate] = useState<Date | null>(null)
	const [status, setStatus] = useState<string>(TaskStatusEnum.TODO)

	const handleDateChange = (value: string) => {
		if (value) {
			setDate(new Date(value))
		} else {
			setDate(null)
		}
	}

	const handleSubmit = () => {
		if (!isFormValid) return

		const newTask: ITask = {
			id: generateId(),
			title: title.trim(),
			description: desc.trim(),
			assignee: assignee.trim(),
			dueDate: date ?? undefined,
			status: status as TaskStatusEnum,
			createdAt: new Date(),
		}

		onAddTask(newTask)
		resetForm()
		onClose()
	}

	const resetForm = () => {
		setTitle('')
		setDesc('')
		setAssignee('')
		setDate(null)
		setStatus(TaskStatusEnum.TODO)
	}

	useEffect(() => {
		if (isOpen) {
			resetForm()
		}
	}, [isOpen])

	const isFormValid = useMemo(() => {
		return title.trim() && desc.trim() && assignee.trim() && status
	}, [assignee, desc, status, title])

	return (
		<ModalOverlay isOpen={isOpen} onCancel={onClose}>
			<div className='bg-white rounded-xl p-6 w-[450px]'>
				<div className='flex items-center justify-between mb-4'>
					<h3 className='text-lg font-semibold'>{'Add New Task'}</h3>
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
							id={'add-task-due-date-input'}
							type='date'
							value={date ? date.toISOString().split('T')[0] : ''}
							setValue={value => handleDateChange(value as string)}
						/>
					</div>

					<div>
						<FormLabel title={'Task status'} isRequired={true} />
						<Combobox
							options={Object.values(TaskStatusEnum)}
							value={status}
							onChange={setStatus}
							className='w-full'
						/>
					</div>

					<div className='flex gap-3 pt-4'>
						<FormButton onClick={onClose} title={'Cancel'} invert={true} />
						<FormButton
							onClick={handleSubmit}
							title={'Add task'}
							disabled={!isFormValid}
						/>
					</div>
				</div>
			</div>
		</ModalOverlay>
	)
}

export default TaskModal
