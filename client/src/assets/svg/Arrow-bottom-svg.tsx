import type { FC } from 'react'
import type { ISvgProps } from '../../types/svg-props'

const ArrowBottomSvg: FC<ISvgProps> = ({ className }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			className={className}
			aria-hidden='true'
		>
			<path d='m6 9 6 6 6-6'></path>
		</svg>
	)
}

export default ArrowBottomSvg
