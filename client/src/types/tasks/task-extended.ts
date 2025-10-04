import type { IAttachment } from '../attachments/attachment'
import type { IUser } from '../users/user'
import type { ITask } from './task'

export interface ITaskExtended extends ITask {
	user: IUser
	attachments: IAttachment[]
}
