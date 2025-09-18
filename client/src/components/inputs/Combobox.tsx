import { type FC, useEffect, useRef, useState } from 'react'
import ArrowBottomSvg from '../../assets/svg/Arrow-bottom-svg'
import TickSvg from '../../assets/svg/Tick-svg'

interface IProps {
	options: string[]
	value: string
	onChange: (value: string) => void
	placeholder?: string
	className?: string
}

const Combobox: FC<IProps> = ({
	options,
	value,
	onChange,
	placeholder = 'Select...',
	className = '',
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const comboRef = useRef<HTMLDivElement | null>(null)

	const selectedOption = options.find(option => option === value)
	const displayValue = selectedOption ? selectedOption : placeholder

	const handleClickOutside = (event: MouseEvent) => {
		if (comboRef.current && !comboRef.current.contains(event.target as Node)) {
			setIsOpen(false)
		}
	}

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	return (
		<div
			ref={comboRef}
			className={`relative inline-block w-full ${className} select-none`}
		>
			<button
				onClick={() => setIsOpen(!isOpen)}
				role='combobox'
				className='flex w-full gap-x-2 justify-between items-center px-3 py-2 border border-black/10 rounded-lg bg-white text-sm text-black cursor-pointer hover:border-black/20 transition-colors duration-200'
			>
				<span className={!selectedOption ? 'text-black/50' : ''}>
					{displayValue}
				</span>

				<ArrowBottomSvg
					className={`h-4 w-4 opacity-70 transition-transform duration-200 ${
						isOpen ? 'rotate-180' : ''
					}`}
				/>
			</button>

			<ul
				className={`absolute left-0 mt-1 z-50 w-full border border-black/10 text-sm font-medium shadow-lg bg-white transition-all duration-200 flex flex-col rounded-lg overflow-hidden max-h-60 overflow-y-auto ${
					isOpen
						? 'opacity-100 translate-y-0 pointer-events-auto'
						: 'opacity-0 -translate-y-2 pointer-events-none'
				}`}
			>
				{options.map(option => (
					<li
						key={option}
						className={`flex items-center px-3 py-2 cursor-pointer hover:bg-black/5 transition-colors duration-200 ${
							value === option ? 'bg-black/5' : ''
						}`}
						onClick={() => {
							onChange(option)
							setIsOpen(false)
						}}
					>
						<span className='flex-1'>{option}</span>

						{value === option && <TickSvg className='size-4 text-purple-600' />}
					</li>
				))}
			</ul>
		</div>
	)
}

export default Combobox
