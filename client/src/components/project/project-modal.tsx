import { useMemo, useState, type FC } from 'react'
import { useDispatch } from 'react-redux'
import * as projectsActions from '../../store/slices/projects-slice'
import FormButton from '../buttons/Form-button'
import FormInput from '../inputs/Form-input'
import FormLabel from '../labels/Form-label'
import ModalOverlay from '../modal/Modal-overlay'

interface IProps {
	isOpen: boolean
	onClose: () => void
}

const ProjectModal: FC<IProps> = ({ isOpen, onClose }) => {
	const dispatch = useDispatch()

	const [title, setTitle] = useState('')

	const isFormValid = useMemo(() => {
		return title.trim()
	}, [title])

	const handleSubmit = () => {
		if (!isFormValid) return

		dispatch(
			projectsActions.addProject({
				title: title.trim(),
			})
		)

		onClose()
		setTitle('')
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
					<div>
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

					<div className='flex gap-3 pt-4'>
						<FormButton onClick={onClose} title={'Cancel'} invert={true} />
						<FormButton
							onClick={handleSubmit}
							title={'Add project'}
							disabled={!isFormValid}
						/>
					</div>
				</div>
			</div>
		</ModalOverlay>
	)
}

export default ProjectModal
