import type { FC } from 'react'

interface IProps {
	title: string
	htmlFor?: string
	isRequired?: boolean
}

const FormLabel: FC<IProps> = ({ title, htmlFor, isRequired = true }) => {
	return (
		<label
			htmlFor={htmlFor}
			className='text-sm font-medium mb-1 leading-none select-none inline-block'
		>
			{title}
			{isRequired && <span className='text-red-500'>{` *`}</span>}
		</label>
	)
}

export default FormLabel
