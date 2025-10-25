import { IProject } from '../../models/project';

export type CreateProjectData = Omit<IProject, 'id' | 'createdAt'>;
