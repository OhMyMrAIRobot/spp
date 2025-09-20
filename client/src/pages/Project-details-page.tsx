import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import FormButton from '../components/buttons/Form-button'
import TaskCardColumn from '../components/task/Task-card-column'
import TaskModal from '../components/task/Task-modal'
import { projectsSelectors } from '../store/selectors/projects-selector'
import { selectTasksByProjectId } from '../store/selectors/tasks-selector'
import type { RootState } from '../store/store'
import type { ITask } from '../types/tasks/task'
import { TaskStatusEnum } from '../types/tasks/task-status/task-status-enum'
import { getTasksByStatus } from '../utils/get-tasks-by-status'

const ProjectDetailsPage = () => {
	const { id: projectId } = useParams()

	const project = useSelector((state: RootState) =>
		projectId ? projectsSelectors.selectById(state, projectId) : undefined
	)

	const tasks = useSelector((state: RootState) =>
		projectId ? selectTasksByProjectId(state, projectId) : []
	)

	const [modalOpen, setModalOpen] = useState<boolean>(false)
	const [selectedTask, setSelectedTask] = useState<ITask | null>(null)

	if (!projectId || !project) {
		return <div>Project not found</div>
	}

	const openAddModal = () => {
		setSelectedTask(null)
		setModalOpen(true)
	}

	const openEditModal = (task: ITask) => {
		setSelectedTask(task)
		setModalOpen(true)
	}

	return (
		<>
			{/* Modal for edit or add task  */}
			<TaskModal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				projectId={project.id}
				task={selectedTask}
			/>

			<div className='flex flex-col gap-5'>
				{/* HEADER */}
				<div className='flex items-center justify-between border-b border-black/5 pb-5'>
					<h2 className='text-[24px] font-bold'>{project.title}</h2>

					<div className='flex'>
						<FormButton onClick={openAddModal} title={'Add Task'} />
					</div>
				</div>

				{/* GRID */}
				<div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-8 h-fit'>
					<TaskCardColumn
						title={TaskStatusEnum.TODO}
						tasks={getTasksByStatus(tasks, TaskStatusEnum.TODO)}
						onEditModal={openEditModal}
					/>
					<TaskCardColumn
						title={TaskStatusEnum.IN_PROGRESS}
						tasks={getTasksByStatus(tasks, TaskStatusEnum.IN_PROGRESS)}
						onEditModal={openEditModal}
					/>
					<TaskCardColumn
						title={TaskStatusEnum.DONE}
						tasks={getTasksByStatus(tasks, TaskStatusEnum.DONE)}
						onEditModal={openEditModal}
					/>
				</div>
			</div>
		</>
	)
}

export default ProjectDetailsPage
