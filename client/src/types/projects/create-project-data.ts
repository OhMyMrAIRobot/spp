import type { IProject } from './project'

export type CreateProjectData = Omit<IProject, 'id' | 'createdAt'>
