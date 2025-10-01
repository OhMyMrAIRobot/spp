import type { FC, ReactNode } from 'react'
import { Link } from 'react-router-dom'

export interface ISidebarItemProps {
	title: string
	icon?: ReactNode
	isActive: boolean
	path: string
	onClick?: () => void
}

const SidebarItem: FC<ISidebarItemProps> = ({
	title,
	isActive,
	icon,
	path,
	onClick,
}) => {
	return (
		<Link
			to={path}
			className='flex gap-x-2 items-center text-black/70'
			onClick={onClick}
		>
			<div
				className={`w-1 h-[90%] rounded-lg bg-purple-500 ${
					isActive ? 'opacity-100' : 'opacity-0'
				}`}
			/>
			<div
				className={`lg:w-full h-full cursor-pointer rounded-lg flex items-center gap-x-1 py-1 px-2 transition-colors duration-200 ${
					isActive ? 'bg-white' : 'hover:bg-white/50'
				}`}
			>
				<div className='size-6 flex items-center justify-center'>{icon}</div>
				<span className='text-[18px] max-lg:hidden'>{title}</span>
			</div>
		</Link>
	)
}

export default SidebarItem
