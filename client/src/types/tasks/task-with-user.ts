import type { IUser } from '../user/user'
import type { ITask } from './task'

export interface ITaskWithUser extends ITask {
	user: IUser
}
