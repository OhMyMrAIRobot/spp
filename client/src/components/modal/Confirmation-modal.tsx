import type { FC } from 'react'
import { createPortal } from 'react-dom'
import FormButton from '../buttons/Form-button'
import ModalOverlay from './Modal-overlay'

interface IProps {
	title: string
	isOpen: boolean
	onConfirm: () => void
	onCancel: () => void
}

const ConfirmationModal: FC<IProps> = ({
	title,
	isOpen,
	onConfirm,
	onCancel,
}) => {
	return createPortal(
		<ModalOverlay isOpen={isOpen} onCancel={onCancel}>
			<div
				className={`relative bg-white rounded-xl p-6 w-[450px] grid gap-6 transition-transform duration-300`}
			>
				<button
					onClick={onCancel}
					className='absolute right-5 top-3 text-black/50 hover:text-black/70'
				>
					✕
				</button>

				<h3 className='text-base lg:text-lg text-center font-bold'>{title}</h3>

				<div className='grid gap-2'>
					<FormButton title={'Confirm'} invert={false} onClick={onConfirm} />
					<FormButton title={'Cancel'} invert={true} onClick={onCancel} />
				</div>
			</div>
		</ModalOverlay>,
		document.body
	)
}

export default ConfirmationModal
