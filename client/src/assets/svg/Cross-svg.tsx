import type { FC } from 'react'
import type { ISvgProps } from '../../types/svg-props'

const CrossSvg: FC<ISvgProps> = ({ className }) => {
	return (
		<svg
			viewBox='-0.5 0 25 25'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			className={className}
		>
			<path
				d='M3 21.32L21 3.32001'
				stroke='currentColor'
				strokeWidth='1.5'
				strokeLinecap='round'
				strokeLinejoin='round'
			></path>
			<path
				d='M3 3.32001L21 21.32'
				stroke='currentColor'
				strokeWidth='1.5'
				strokeLinecap='round'
				strokeLinejoin='round'
			></path>
		</svg>
	)
}

export default CrossSvg
