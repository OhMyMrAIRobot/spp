import type { IUser } from '../users/user'

export interface IProject {
	id: string
	title: string
	description: string
	members: IUser[]
	createdAt: string
}
