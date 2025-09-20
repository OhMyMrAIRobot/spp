import { useState } from 'react'
import { useSelector } from 'react-redux'
import { projectsSelectors } from '../../../store/selectors/projects-selector'
import { tasksSelectors } from '../../../store/selectors/tasks-selector'
import FormButton from '../../buttons/Form-button'
import ProjectModal from '../project-modal'
import ProjectCard from './Project-card'

const ProjectList = () => {
	const projects = useSelector(projectsSelectors.selectAll)
	const tasks = useSelector(tasksSelectors.selectAll)

	const [modalOpen, setModalOpen] = useState<boolean>(false)

	return (
		<>
			<ProjectModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

			<div className='size-full p-6'>
				{/* Header */}
				<div className='flex items-center justify-between mb-6'>
					<h1 className='text-2xl font-bold text-black'>Projects</h1>

					<div className='flex gap-5 items-center'>
						<span className='text-black/50'>
							{projects.length} project{projects.length !== 1 ? 's' : ''}
						</span>
						<FormButton
							onClick={() => setModalOpen(true)}
							title={'Add Project'}
						/>
					</div>
				</div>

				{/* Projects grid */}
				<div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
					{projects.map(project => {
						const projectTasks = tasks.filter(t =>
							project.taskIds.includes(t.id)
						)
						return (
							<ProjectCard
								key={project.id}
								project={project}
								tasks={projectTasks}
							/>
						)
					})}
				</div>

				{/* Empty state */}
				{projects.length === 0 && (
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
