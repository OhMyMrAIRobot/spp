import { useState } from 'react'
import { useGetProjectsQuery } from '../../../store/services/project-api-service'
import FormButton from '../../buttons/Form-button'
import SkeletonLoader from '../../loaders/Skeleton-loader'
import ProjectCard from './Project-card'
import ProjectModal from './Project-modal'

const ProjectList = () => {
	const { data: projects, isLoading: isProjectsLoading } = useGetProjectsQuery()

	const [modalOpen, setModalOpen] = useState<boolean>(false)

	return (
		<>
			<ProjectModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

			<div className='size-full p-6'>
				{/* Header */}
				<div className='flex items-center justify-between mb-6'>
					<h1 className='text-2xl font-bold text-black'>My Projects</h1>

					<div className='flex gap-5 items-center'>
						{isProjectsLoading ? (
							<SkeletonLoader className={'w-20 h-6 rounded-lg'} />
						) : (
							<span className='text-black/50'>
								{projects?.length} project{projects?.length !== 1 ? 's' : ''}
							</span>
						)}

						<FormButton
							onClick={() => setModalOpen(true)}
							title={'Add Project'}
							disabled={isProjectsLoading}
						/>
					</div>
				</div>

				{/* Projects grid */}
				<div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
					{isProjectsLoading
						? Array.from({ length: 15 }).map((_, idx) => (
								<ProjectCard
									key={`Project-card-skeleton-${idx}`}
									isLoading={true}
								/>
						  ))
						: projects &&
						  projects.map(project => {
								return (
									<ProjectCard
										key={project.id}
										project={project}
										isLoading={false}
									/>
								)
						  })}
				</div>

				{/* Empty state */}
				{!isProjectsLoading && projects?.length === 0 && (
					<div className='flex flex-col items-center justify-center py-12 text-center'>
						<h3 className='text-lg font-medium text-black/60 mb-2'>
							No projects yet
						</h3>
						<p className='text-black/40'>
							Create your first project to get started
						</p>
					</div>
				)}
			</div>
		</>
	)
}

export default ProjectList
