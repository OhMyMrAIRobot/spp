import type { FC } from 'react'
import ProjectList from '../components/project/project-list/Project-list'
import type { IProject } from '../types/projects/project'

interface IProps {
	projects: IProject[]
}

const ProjectsPage: FC<IProps> = ({ projects }) => {
	return (
		<div className='h-fit bg-gray-50 rounded-lg'>
			<ProjectList projects={projects} />
		</div>
	)
}

export default ProjectsPage
