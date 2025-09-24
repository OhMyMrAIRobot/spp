import { IProject } from '../../../models/project/project';

export type ProjectParams = {
  id: string;
};

export type CreateProjectBody = Omit<IProject, '_id' | 'createdAt'>;

export type UpdateProjectBody = Partial<CreateProjectBody>;
