import { useEffect, useMemo, useState, type FC } from 'react'
import toast from 'react-hot-toast'
import {
	useCreateProjectMutation,
	useUpdateProjectMutation,
} from '../../../store/services/project-api-service'
import { useGetUsersQuery } from '../../../store/services/user-api-service'
import type { ApiError } from '../../../types/api-errors'
import type { CreateProjectData } from '../../../types/projects/create-project-data'
import type { IProject } from '../../../types/projects/project'
import type { IUser } from '../../../types/user/user'
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

	useEffect(() => {
		if (project) {
			setTitle(project.title)
			setDescription(project.description)
			setMembers(project.members || [])
		} else {
			setTitle('')
			setDescription('')
			setMembers([])
		}
	}, [project, isOpen])

	const { data: users = [] } = useGetUsersQuery()
	const [createProject, { isLoading: isCreating }] = useCreateProjectMutation()
	const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation()

	const isFormValid = useMemo(() => {
		return title.trim() && description.trim()
	}, [description, title])

	const handleSubmit = () => {
		if (!isFormValid || isLoading) return

		const data: CreateProjectData = {
			title: title.trim(),
			description: description.trim(),
			members,
		}

		const promise = project
			? updateProject({ id: project.id, changes: data }).unwrap()
			: createProject(data).unwrap()

		promise.catch(err => {
			const apiError = err as ApiError

			if (apiError.data?.errors?.length) {
				apiError.data.errors.forEach(e => toast.error(e.message))
			} else if (apiError.data?.message) {
				toast.error(apiError.data.message)
			} else {
				toast.error('Something went wrong')
			}
		})

		onClose()
	}

	const isLoading = isCreating || isUpdating

	return (
		<ModalOverlay isOpen={isOpen} onCancel={onClose}>
			<div className='bg-white rounded-xl p-6 w-[450px]'>
				<div className='flex items-center justify-between mb-4'>
					<h3 className='text-lg font-semibold'>
						{project ? 'Edit Project' : 'Add New Project'}
					</h3>
					<button
						onClick={onClose}
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
						<FormButton onClick={onClose} title='Cancel' invert={true} />
						<FormButton
							onClick={handleSubmit}
							title={project ? 'Edit Project' : 'Add New Project'}
							disabled={!isFormValid || isLoading}
						/>
					</div>
				</div>
			</div>
		</ModalOverlay>
	)
}

export default ProjectModal
