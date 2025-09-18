import { useState, type FC } from 'react'
import ProjectCardFilterButton from '../components/project/Project-page-filter-button'
import TaskCardColumn from '../components/task/Task-card-column'
import TaskModal from '../components/task/Task-modal'
import { mockTasks } from '../data'
import type { IProject } from '../types/projects/project'
import type { ITask } from '../types/tasks/task'
import { TaskStatusEnum } from '../types/tasks/task-status/task-status-enum'
import { TaskStatusFilterOptions } from '../types/tasks/task-status/task-status-filter-options'
import { getTasksByStatus } from '../utils/get-tasks-by-status'

interface IProps {
	project: IProject
}

const ProjectPage: FC<IProps> = ({ project }) => {
	const [tasks, setTasks] = useState<ITask[]>(mockTasks)

	const [addModalOpen, setAddModalOpen] = useState<boolean>(false)

	const handleAddTask = (newTask: ITask) => {
		setTasks(prev => [...prev, newTask])
	}

	return (
		<>
			{/* Modal for edit or add task  */}
			<TaskModal
				isOpen={addModalOpen}
				onClose={() => setAddModalOpen(false)}
				onAddTask={handleAddTask}
			/>

			<div className='flex flex-col gap-5'>
				{/* HEADER */}
				<div className='flex items-center justify-between border-b border-black/5 pb-5'>
					<h2 className='text-[24px] font-bold'>{project.title}</h2>

					<button
						onClick={() => setAddModalOpen(true)}
						className='px-4 py-2 flex items-center justify-center text-white bg-purple-700 hover:bg-purple-800 duration-200 transition-colors rounded-lg cursor-pointer text-sm gap-x-1 font-medium h-10'
					>
						Add Task
					</button>
				</div>

				{/* FILTER AND SORT */}
				<div className='flex flex-wrap gap-x-4 items-center'>
					{Object.values(TaskStatusFilterOptions).map((status, idx) => (
						<ProjectCardFilterButton
							key={status}
							title={status}
							onClick={() => {}}
							isActive={idx === 0}
						/>
					))}
				</div>

				{/* GRID */}
				<div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-8 h-fit'>
					<TaskCardColumn
						title={TaskStatusEnum.TODO}
						tasks={getTasksByStatus(tasks, TaskStatusEnum.TODO)}
					/>
					<TaskCardColumn
						title={TaskStatusEnum.IN_PROGRESS}
						tasks={getTasksByStatus(tasks, TaskStatusEnum.IN_PROGRESS)}
					/>
					<TaskCardColumn
						title={TaskStatusEnum.DONE}
						tasks={getTasksByStatus(tasks, TaskStatusEnum.DONE)}
					/>
				</div>
			</div>
		</>
	)
}

export default ProjectPage
