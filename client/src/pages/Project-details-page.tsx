import { useState } from 'react'
import { useParams } from 'react-router-dom'
import FormButton from '../components/buttons/Form-button'
import SkeletonLoader from '../components/loaders/Skeleton-loader'
import TaskCardColumn from '../components/task/Task-card-column'
import TaskModal from '../components/task/Task-modal'
import { useGetProjectByIdQuery } from '../store/services/project-api-service'
import { useGetTasksByProjectQuery } from '../store/services/task-api-service'
import type { ITask } from '../types/tasks/task'
import { TaskStatusEnum } from '../types/tasks/task-status-enum'
import { getTasksByStatus } from '../utils/get-tasks-by-status'

const ProjectDetailsPage = () => {
	const { id } = useParams()

	const projectId = id ?? ''

	const { data: project, isLoading: isProjectLoading } = useGetProjectByIdQuery(
		projectId,
		{ skip: !projectId }
	)

	const { data: tasks, isLoading: isTasksLoading } = useGetTasksByProjectQuery(
		projectId,
		{ skip: !projectId }
	)

	const [modalOpen, setModalOpen] = useState<boolean>(false)
	const [selectedTask, setSelectedTask] = useState<ITask | null>(null)

	const openAddModal = () => {
		setSelectedTask(null)
		setModalOpen(true)
	}

	const openEditModal = (task: ITask) => {
		setSelectedTask(task)
		setModalOpen(true)
	}

	if (!project && !isProjectLoading && !isTasksLoading)
		return <div>Project not found!</div>

	const isLoading = isProjectLoading || isTasksLoading

	return (
		<>
			{/* Modal for edit or add task  */}
			{project && (
				<TaskModal
					isOpen={modalOpen}
					onClose={() => setModalOpen(false)}
					projectId={project.id}
					task={selectedTask}
				/>
			)}

			<div className='flex flex-col gap-5'>
				{/* HEADER */}
				<div className='flex gap-5 items-top border-b border-black/5 pb-5'>
					<div className='grid gap-y-1'>
						{!project ? (
							<SkeletonLoader className={'w-40 h-7 rounded-lg'} />
						) : (
							<h2 className='text-[24px] font-bold'>{project.title}</h2>
						)}

						<h6 className='text-black/50 text-sm'>{project?.description}</h6>
					</div>

					<div className='w-fit ml-auto'>
						<FormButton
							onClick={openAddModal}
							title={'Add Task'}
							disabled={isLoading}
						/>
					</div>
				</div>

				{/* GRID */}
				<div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-8 h-fit'>
					<TaskCardColumn
						title={TaskStatusEnum.TODO}
						tasks={tasks ? getTasksByStatus(tasks, TaskStatusEnum.TODO) : []}
						onEditModal={openEditModal}
						isLoading={isLoading}
					/>
					<TaskCardColumn
						title={TaskStatusEnum.IN_PROGRESS}
						tasks={
							tasks ? getTasksByStatus(tasks, TaskStatusEnum.IN_PROGRESS) : []
						}
						onEditModal={openEditModal}
						isLoading={isLoading}
					/>
					<TaskCardColumn
						title={TaskStatusEnum.DONE}
						tasks={tasks ? getTasksByStatus(tasks, TaskStatusEnum.DONE) : []}
						onEditModal={openEditModal}
						isLoading={isLoading}
					/>
				</div>
			</div>
		</>
	)
}

export default ProjectDetailsPage
