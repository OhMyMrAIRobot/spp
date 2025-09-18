import type { FC } from 'react'

interface IProps {
	title: string
	onClick: () => void
	isActive: boolean
}

const ProjectCardFilterButton: FC<IProps> = ({ title, onClick, isActive }) => {
	return (
		<button
			onClick={onClick}
			className={`px-4 py-2 text-sm rounded-full ${
				isActive ? 'font-semibold bg-black/5' : 'hover:bg-black/5'
			}`}
		>
			{title}
		</button>
	)
}

export default ProjectCardFilterButton
