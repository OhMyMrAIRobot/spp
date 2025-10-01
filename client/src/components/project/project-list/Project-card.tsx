import { useState, type FC } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import DeleteSvg from '../../../assets/svg/Delete-svg'
import EditSvg from '../../../assets/svg/Edit-svg'
import { ROUTES } from '../../../routes/routes'
import { useDeleteProjectMutation } from '../../../store/services/project-api-service'
import type { RootState } from '../../../store/store'
import type { IProjectWithStats } from '../../../types/projects/project-with-stats'
import { UserRoleEnum } from '../../../types/user/user-role-enum'
import { dateUtils } from '../../../utils/date-util'
import SkeletonLoader from '../../loaders/Skeleton-loader'
import ConfirmationModal from '../../modal/Confirmation-modal'

interface IProps {
	project?: IProjectWithStats
	isLoading: boolean
	onEditClick?: () => void
}

const ProjectCard: FC<IProps> = ({ project, isLoading, onEditClick }) => {
	const { user } = useSelector((state: RootState) => state.auth)

	const [modalOpen, setModalOpen] = useState<boolean>(false)

	const [deleteProject] = useDeleteProjectMutation()

	if (isLoading || !project)
		return <SkeletonLoader className={'w-full rounded-lg h-44'} />

	const totalTasksCount =
		project.taskCounts.DONE +
		project.taskCounts.IN_PROGRESS +
		project.taskCounts.TODO

	const completionPercentage =
		totalTasksCount > 0
			? Math.round((project.taskCounts.DONE / totalTasksCount) * 100)
			: 0

	const projectDetailsPath = ROUTES.PROJECT_DETAILS.replace(':id', project.id)

	const handleEditClick = (e: React.MouseEvent) => {
		e.preventDefault()
		onEditClick?.()
	}

	const handleDeleteClick = (e: React.MouseEvent) => {
		e.preventDefault()
		setModalOpen(true)
	}

	return (
		<>
			{modalOpen && (
				<ConfirmationModal
					title={'Delete project?'}
					isOpen={modalOpen}
					onConfirm={() => deleteProject(project.id)}
					onCancel={() => setModalOpen(false)}
				/>
			)}

			<Link
				to={projectDetailsPath}
				className={`relative border border-black/10 rounded-xl bg-white hover:bg-black/[0.01] transition-colors duration-200 cursor-pointer p-5 flex flex-col h-full group ${
					project.id.startsWith('temp') ? 'opacity-60 pointer-events-none' : ''
				}`}
			>
				{user?.role === UserRoleEnum.ADMIN && (
					<div className='absolute right-3 top-3 flex gap-x-2 opacity-0 group-hover:opacity-100 duration-100'>
						<button
							onClick={handleEditClick}
							className='p-2 hover:bg-black/5 rounded-lg transition-all duration-200'
						>
							<EditSvg className={'size-5'} />
						</button>

						<button
							onClick={handleDeleteClick}
							className='p-2 hover:bg-red-100 rounded-lg transition-all duration-20'
						>
							<DeleteSvg className={'size-5'} />
						</button>
					</div>
				)}

				{/* Header */}
				<h3 className='text-lg font-semibold text-black'>{project.title}</h3>

				<p className='text-sm text-black/50 mb-2 line-clamp-3 overflow-hidden'>
					{project.description}
				</p>

				<div className='flex-1'></div>

				<span className='text-sm text-black/50 mb-2'>
					Created {dateUtils.format(project.createdAt)}
				</span>

				{/* Task counters */}
				<div className='flex items-center gap-4 mb-2'>
					<div className='flex items-center gap-1'>
						<div className='w-2 h-2 bg-blue-500 rounded-full' />
						<span className='text-sm text-black/70'>
							Todo: {project.taskCounts.TODO}
						</span>
					</div>
					<div className='flex items-center gap-1'>
						<div className='w-2 h-2 bg-yellow-500 rounded-full' />
						<span className='text-sm text-black/70'>
							In Progress: {project.taskCounts.IN_PROGRESS}
						</span>
					</div>
					<div className='flex items-center gap-1'>
						<div className='w-2 h-2 bg-green-500 rounded-full' />
						<span className='text-sm text-black/70'>
							Done: {project.taskCounts.DONE}
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
							{project.taskCounts.DONE} of {totalTasksCount} tasks completed
						</span>
						<span className='text-sm font-medium text-purple-700'>
							{completionPercentage}%
						</span>
					</div>
				</div>
			</Link>
		</>
	)
}

export default ProjectCard
