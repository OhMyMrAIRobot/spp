import type { FC } from 'react'
import type { IProject } from '../../../types/projects/project'
import ProjectCard from './Project-card'

interface IProps {
	projects: IProject[]
	onProjectClick?: (project: IProject) => void
}

const ProjectList: FC<IProps> = ({ projects, onProjectClick }) => {
	return (
		<div className='size-full p-6'>
			{/* Header */}
			<div className='flex items-center justify-between mb-6'>
				<h1 className='text-2xl font-bold text-black'>Projects</h1>
				<span className='text-black/50'>
					{projects.length} project{projects.length !== 1 ? 's' : ''}
				</span>
			</div>

			{/* Projects grid */}
			<div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
				{projects.map(project => (
					<ProjectCard
						key={project.id}
						project={project}
						onClick={onProjectClick}
					/>
				))}
			</div>

			{/* Empty state */}
			{projects.length === 0 && (
				<div className='flex flex-col items-center justify-center py-12 text-center'>
					<div className='text-black/30 text-6xl mb-4'>📁</div>
					<h3 className='text-lg font-medium text-black/60 mb-2'>
						No projects yet
					</h3>
					<p className='text-black/40'>
						Create your first project to get started
					</p>
				</div>
			)}
		</div>
	)
}

export default ProjectList
