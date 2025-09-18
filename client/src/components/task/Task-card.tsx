import type { FC } from 'react'
import CalendarSvg from '../../assets/svg/Calendar-svg'
import UserTickSvg from '../../assets/svg/User-tick-svg'
import type { ITask } from '../../types/tasks/task'
import { dateUtils } from '../../utils/date-util'

interface IProps {
	task: ITask
}

const TaskCard: FC<IProps> = ({ task }) => {
	return (
		<div className='border border-black/10 rounded-lg bg-white hover:bg-black/[0.01]'>
			<div className='flex flex-col px-3 py-1.5'>
				<h6 className='font-medium pb-1'>{task.title}</h6>
				<p className='font-light text-sm pb-2'>{task.description}</p>

				<div className='text-sm flex items-center gap-x-1'>
					<UserTickSvg className={'size-5'} />
					<span className='font-medium'>{task.assignee}</span>
				</div>
			</div>

			{task.dueDate && (
				<div className='text-black/50 text-sm font-medium flex items-center gap-x-1 mt-2 border-t border-black/10 px-3 py-2'>
					<CalendarSvg className='size-4' />
					Due Date: {dateUtils.format(task.dueDate)}
				</div>
			)}
		</div>
	)
}

export default TaskCard
