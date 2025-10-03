import type { FC, ReactNode } from 'react'

interface IProps {
	className: string
	children?: ReactNode
}

const SkeletonLoader: FC<IProps> = ({ className, children }) => {
	return (
		<div className={`bg-gray-300 animate-pulse opacity-50 ${className}`}>
			{children}
		</div>
	)
}

export default SkeletonLoader
