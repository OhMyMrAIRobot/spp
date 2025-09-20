import type { FC } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../../routes/routes'
import type { IProject } from '../../../types/projects/project'
import type { ITask } from '../../../types/tasks/task'
import { TaskStatusEnum } from '../../../types/tasks/task-status/task-status-enum'
import { dateUtils } from '../../../utils/date-util'
import { getTasksByStatus } from '../../../utils/get-tasks-by-status'

interface IProps {
	project: IProject
	tasks: ITask[]
}

const ProjectCard: FC<IProps> = ({ project, tasks }) => {
	const todoTasks = getTasksByStatus(tasks, TaskStatusEnum.TODO)
	const inProgressTasks = getTasksByStatus(tasks, TaskStatusEnum.IN_PROGRESS)
	const doneTasks = getTasksByStatus(tasks, TaskStatusEnum.DONE)

	const completionPercentage =
		tasks.length > 0 ? Math.round((doneTasks.length / tasks.length) * 100) : 0

	const projectDetailsPath = ROUTES.PROJECT_DETAILS.replace(':id', project.id)

	return (
		<Link
			to={projectDetailsPath}
			className='border border-black/10 rounded-xl bg-white hover:bg-black/[0.01] transition-colors duration-200 cursor-pointer p-5 flex flex-col h-full'
		>
			{/* Header */}
			<h3 className='text-lg font-semibold text-black mb-1'>{project.title}</h3>

			<span className='text-sm text-black/50 mb-4'>
				Created {dateUtils.format(project.createdAt)}
			</span>

			<div className='flex-1'></div>

			{/* Task counters */}
			<div className='flex items-center gap-4 mb-2'>
				<div className='flex items-center gap-1'>
					<div className='w-2 h-2 bg-blue-500 rounded-full' />
					<span className='text-sm text-black/70'>
						Todo: {todoTasks.length}
					</span>
				</div>
				<div className='flex items-center gap-1'>
					<div className='w-2 h-2 bg-yellow-500 rounded-full' />
					<span className='text-sm text-black/70'>
						In Progress: {inProgressTasks.length}
					</span>
				</div>
				<div className='flex items-center gap-1'>
					<div className='w-2 h-2 bg-green-500 rounded-full' />
					<span className='text-sm text-black/70'>
						Done: {doneTasks.length}
					</span>
				</div>
			</div>

			{/* Progress bar and footer */}
			<div className='mt-auto'>
				<div className='w-full bg-black/5 rounded-full h-2 mb-2'>
					<div
						className='bg-purple-600 h-2 rounded-full transition-all duration-300'
						style={{
							width: `${completionPercentage}%`,
						}}
					/>
				</div>

				{/* Footer */}
				<div className='flex items-center justify-between'>
					<span className='text-sm text-black/50'>
						{doneTasks.length} of {tasks.length} tasks completed
					</span>
					<span className='text-sm font-medium text-purple-700'>
						{completionPercentage}%
					</span>
				</div>
			</div>
		</Link>
	)
}

export default ProjectCard
