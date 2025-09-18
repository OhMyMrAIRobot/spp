import type { FC } from 'react'
import type { ISvgProps } from '../../types/svg-props'

const ListSvg: FC<ISvgProps> = ({ className }) => {
	return (
		<svg
			viewBox='0 0 24 24'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			className={className}
		>
			<path
				d='M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
			></path>{' '}
			<path
				d='M12 12H15'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
			></path>{' '}
			<path
				d='M12 16H15'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
			></path>{' '}
			<path
				d='M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
			></path>
			<circle cx='9' cy='12' r='1' fill='currentColor'></circle>
			<circle cx='9' cy='16' r='1' fill='currentColor'></circle>
		</svg>
	)
}

export default ListSvg
