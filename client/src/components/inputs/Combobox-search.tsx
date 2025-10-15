import { useState } from 'react'
import TickSvg from '../../assets/svg/Tick-svg'

interface Option<T> {
	id: string
	label: string
	raw: T
}

interface IProps<T> {
	id: string
	value: string[]
	setValue: (val: string[]) => void
	options: Option<T>[]
	placeholder?: string
}

const ComboboxSearch = <T,>({
	id,
	value,
	setValue,
	options,
	placeholder,
}: IProps<T>) => {
	const [query, setQuery] = useState('')
	const [open, setOpen] = useState(false)

	const filtered =
		query.trim().length > 0
			? options.filter(opt =>
					opt.label.toLowerCase().includes(query.toLowerCase())
			  )
			: options

	const toggleSelect = (id: string) => {
		if (value.includes(id)) {
			setValue(value.filter(v => v !== id))
		} else {
			setValue([...value, id])
		}
	}

	return (
		<div className='w-full relative'>
			<input
				id={id}
				type='text'
				value={query}
				onChange={e => {
					setQuery(e.target.value)
					setOpen(true)
				}}
				onFocus={() => setOpen(true)}
				onBlur={() => setTimeout(() => setOpen(false), 150)}
				placeholder={placeholder}
				className='w-full px-3 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
			/>

			{open && filtered.length > 0 && (
				<ul className='absolute z-10 left-0 right-0 mt-1 border border-black/10 rounded-lg max-h-40 overflow-y-auto bg-white shadow'>
					{filtered.map(opt => (
						<li
							key={opt.id}
							onClick={() => toggleSelect(opt.id)}
							className='px-3 py-2 cursor-pointer hover:bg-purple-50 flex justify-between items-center'
						>
							<span>{opt.label}</span>
							{value.includes(opt.id) && (
								<TickSvg className='size-4 text-purple-500' />
							)}
						</li>
					))}
				</ul>
			)}

			{value.length > 0 && (
				<div className='flex flex-wrap gap-1 mt-2'>
					{value.map(id => {
						const opt = options.find(o => o.id === id)
						return (
							<span
								key={id}
								onClick={() => toggleSelect(id)}
								className='px-2 py-1 bg-purple-100 hover:bg-purple-200 rounded-md text-sm cursor-pointer'
							>
								{opt?.label || id}
							</span>
						)
					})}
				</div>
			)}
		</div>
	)
}

export default ComboboxSearch
