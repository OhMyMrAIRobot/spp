import type { FC } from 'react'

interface IProps {
	id: string
	value: string
	setValue: (val: string) => void
	rows?: number
	placeholder?: string
}

const FormTextbox: FC<IProps> = ({
	id,
	value,
	setValue,
	rows = 3,
	placeholder = '',
}) => {
	return (
		<textarea
			id={id}
			value={value}
			onChange={e => setValue(e.target.value)}
			rows={rows}
			placeholder={placeholder}
			className='w-full px-3 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none'
		/>
	)
}

export default FormTextbox
