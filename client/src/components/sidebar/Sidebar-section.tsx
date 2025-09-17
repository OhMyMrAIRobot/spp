import type { FC, ReactNode } from 'react'

interface IProps {
	title: string
	children: ReactNode
}

const SidebarSection: FC<IProps> = ({ title, children }) => {
	return (
		<div>
			<div className='text-sm font-medium text-black/60 pb-2'>{title}</div>
			<div className='grid gap-1.5'>{children}</div>
		</div>
	)
}

export default SidebarSection
