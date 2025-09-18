import type { FC } from 'react'

interface IProps {
	onClick: () => void
	title: string
	invert?: boolean
	disabled?: boolean
}

const FormButton: FC<IProps> = ({
	onClick,
	invert = false,
	title,
	disabled = false,
}) => {
	return (
		<button
			type='button'
			onClick={onClick}
			disabled={disabled}
			className={`flex-1 px-4 py-2 rounded-lg transition-colors duration-200 ${
				disabled ? 'pointer-events-none opacity-40' : ''
			} ${
				invert
					? 'border border-black/10 hover:bg-black/5'
					: 'bg-purple-700 text-white hover:bg-purple-800'
			}`}
		>
			{title}
		</button>
	)
}

export default FormButton
