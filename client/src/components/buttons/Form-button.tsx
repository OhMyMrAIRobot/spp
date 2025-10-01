import type { FC } from 'react'
import Loader from '../loaders/Loader'

interface IProps {
	onClick?: () => void
	title: string
	invert?: boolean
	disabled?: boolean
	isLoading?: boolean
}

const FormButton: FC<IProps> = ({
	onClick,
	invert = false,
	title,
	disabled = false,
	isLoading = false,
}) => {
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			className={`flex flex-1 items-center justify-center px-4 py-2 gap-x-3 rounded-lg transition-colors text-nowrap duration-200 ${
				disabled || isLoading ? 'pointer-events-none opacity-40' : ''
			} ${
				invert
					? 'border border-black/10 hover:bg-black/5'
					: 'bg-purple-700 text-white hover:bg-purple-800'
			}`}
		>
			{isLoading && (
				<Loader
					className={`size-5 ${invert ? 'border-black' : 'border-white'}`}
				/>
			)}
			{title}
		</button>
	)
}

export default FormButton
