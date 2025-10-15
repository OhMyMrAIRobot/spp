import { useEffect, useMemo, useState, type FC } from 'react'
import toast from 'react-hot-toast'
import {
	useCreateProject,
	useUpdateProject,
} from '../../../graphql/hooks/use-projects'
import { useGetUsers } from '../../../graphql/hooks/use-users'
import { extractApolloErrors } from '../../../graphql/utils/apollo-error-handler'
import type { CreateProjectData } from '../../../types/projects/create-project-data'
import type { IProject } from '../../../types/projects/project'
import type { IUser } from '../../../types/users/user'
import FormButton from '../../buttons/Form-button'
import ComboboxSearch from '../../inputs/Combobox-search'
import FormInput from '../../inputs/Form-input'
import FormTextbox from '../../inputs/Form-textbox'
import FormLabel from '../../labels/Form-label'
import ModalOverlay from '../../modal/Modal-overlay'

interface IProps {
	isOpen: boolean
	onClose: () => void
	project: IProject | null
}

const ProjectModal: FC<IProps> = ({ isOpen, onClose, project }) => {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [members, setMembers] = useState<string[]>([])

	const [internalIsOpen, setInternalIsOpen] = useState(false)

	const [errorFormData, setErrorFormData] = useState<CreateProjectData | null>(
		null
	)

	const [isRestoredFromError, setIsRestoredFromError] = useState(false)

	useEffect(() => {
		setInternalIsOpen(isOpen)
	}, [isOpen])

	useEffect(() => {
		if (internalIsOpen) {
			if (errorFormData && !isRestoredFromError) {
				setTitle(errorFormData.title)
				setDescription(errorFormData.description)
				setMembers(errorFormData.members)
				setIsRestoredFromError(true)
			} else if (project && !errorFormData) {
				setTitle(project.title)
				setDescription(project.description)
				setMembers(project.members.map(m => m.id) || [])
			} else if (!project && !errorFormData) {
				setTitle('')
				setDescription('')
				setMembers([])
			}
		} else {
			if (!errorFormData) {
				setIsRestoredFromError(false)
			}
		}
	}, [internalIsOpen, project, errorFormData, isRestoredFromError])

	const { users = [] } = useGetUsers()
	const { createProject, loading: isCreating } = useCreateProject()
	const { updateProject, loading: isUpdating } = useUpdateProject()

	const isFormValid = useMemo(() => {
		return title.trim() && description.trim()
	}, [description, title])

	const handleClose = () => {
		setInternalIsOpen(false)
		setErrorFormData(null)
		setIsRestoredFromError(false)
		onClose()
	}

	const handleSubmit = () => {
		if (!isFormValid || isLoading) return

		const data: CreateProjectData = {
			title: title.trim(),
			description: description.trim(),
			members,
		}

		setInternalIsOpen(false)
		setIsRestoredFromError(false)
		onClose()

		const promise = project
			? updateProject(project.id, data)
			: createProject(data)

		promise
			.then(() => {
				toast.success(
					project
						? 'Project updated successfully'
						: 'Project created successfully'
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

				setErrorFormData({
					title: data.title,
					description: data.description,
					members: data.members,
				})

				setTimeout(() => {
					setInternalIsOpen(true)
					setIsRestoredFromError(false)
				}, 100)
			})
	}

	const isLoading = isCreating || isUpdating

	return (
		<ModalOverlay isOpen={internalIsOpen} onCancel={handleClose}>
			<div className='bg-white rounded-xl p-6 w-[450px]'>
				<div className='flex items-center justify-between mb-4'>
					<h3 className='text-lg font-semibold'>
						{project ? 'Edit Project' : 'Add New Project'}
					</h3>
					<button
						onClick={handleClose}
						className='text-black/50 hover:text-black/70'
					>
						✕
					</button>
				</div>

				<div className='space-y-4'>
					<div className='grid gap-1'>
						<FormLabel
							title='Project Title'
							htmlFor='add-project-title-input'
							isRequired
						/>
						<FormInput
							id='add-project-title-input'
							type='text'
							value={title}
							setValue={setTitle}
							placeholder='Enter project title'
						/>
					</div>

					<div className='grid gap-1'>
						<FormLabel
							title='Project Description'
							htmlFor='add-project-description-input'
							isRequired
						/>
						<FormTextbox
							id='add-project-description-input'
							value={description}
							setValue={setDescription}
							placeholder='Enter project description'
						/>
					</div>

					<div className='grid gap-1'>
						<FormLabel
							title='Project Members'
							htmlFor='add-project-members-input'
						/>
						<ComboboxSearch<IUser>
							id='members'
							value={members}
							setValue={setMembers}
							options={users.map(u => ({
								id: u.id,
								label: u.username,
								raw: u,
							}))}
							placeholder='Search users...'
						/>
					</div>

					<div className='flex gap-3 pt-4'>
						<FormButton onClick={handleClose} title='Cancel' invert={true} />
						<FormButton
							onClick={handleSubmit}
							title={project ? 'Edit Project' : 'Add New Project'}
							disabled={!isFormValid || isLoading}
							isLoading={isLoading}
						/>
					</div>
				</div>
			</div>
		</ModalOverlay>
	)
}

export default ProjectModal
