import { useMemo, useState, type FC } from 'react'
import { useCreateProjectMutation } from '../../../store/services/project-api-service'
import type { CreateProjectData } from '../../../types/projects/create-project-data'
import FormButton from '../../buttons/Form-button'
import FormInput from '../../inputs/Form-input'
import FormTextbox from '../../inputs/Form-textbox'
import FormLabel from '../../labels/Form-label'
import ModalOverlay from '../../modal/Modal-overlay'

interface IProps {
	isOpen: boolean
	onClose: () => void
}

const ProjectModal: FC<IProps> = ({ isOpen, onClose }) => {
	const [title, setTitle] = useState<string>('')
	const [description, setDescription] = useState<string>('')

	const isFormValid = useMemo(() => {
		return title.trim() && description.trim()
	}, [description, title])

	const [createProject, { isLoading }] = useCreateProjectMutation()

	const handleSubmit = async () => {
		if (!isFormValid) return

		const data: CreateProjectData = {
			title: title.trim(),
			description: description.trim(),
			members: [],
		}

		try {
			createProject(data)
			setTitle('')
			setDescription('')
			onClose()
		} catch {
			/* empty */
		}
	}

	return (
		<ModalOverlay isOpen={isOpen} onCancel={onClose}>
			<div className='bg-white rounded-xl p-6 w-[450px]'>
				<div className='flex items-center justify-between mb-4'>
					<h3 className='text-lg font-semibold'>Add New Project</h3>
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
							title={'Project Title'}
							htmlFor={'add-project-title-input'}
							isRequired={true}
						/>
						<FormInput
							value={title}
							setValue={setTitle}
							placeholder={'Enter project title'}
							id={'add-project-title-input'}
							type={'text'}
						/>
					</div>

					<div className='grid gap-1'>
						<FormLabel
							title={'Project Description'}
							htmlFor={'add-project-description-input'}
							isRequired={true}
						/>
						<FormTextbox
							value={description}
							setValue={setDescription}
							placeholder={'Enter project descritpion'}
							id={'add-project-description-input'}
						/>
					</div>

					<div className='flex gap-3 pt-4'>
						<FormButton onClick={onClose} title={'Cancel'} invert={true} />
						<FormButton
							onClick={handleSubmit}
							title={'Add project'}
							disabled={!isFormValid || isLoading}
						/>
					</div>
				</div>
			</div>
		</ModalOverlay>
	)
}

export default ProjectModal
