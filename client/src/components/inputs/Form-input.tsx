import type { FC } from 'react'

interface IProps {
	id: string
	value: string
	type: string
	setValue: (val: string) => void
	placeholder?: string
}

const FormInput: FC<IProps> = ({
	id,
	value,
	setValue,
	placeholder = '',
	type,
}) => {
	return (
		<input
			id={id}
			type={type}
			value={value}
			onChange={e => setValue(e.target.value)}
			className='w-full px-3 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
			placeholder={placeholder}
		/>
	)
}

export default FormInput
