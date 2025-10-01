import { IProject } from '../../../models/project';

export type ProjectParams = {
  id: string;
};

export type CreateProjectBody = Omit<IProject, 'id' | 'createdAt'>;

export type UpdateProjectBody = Partial<CreateProjectBody>;
