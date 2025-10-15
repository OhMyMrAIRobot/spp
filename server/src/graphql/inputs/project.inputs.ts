import { IProject } from '../../models/project';

export type ProjectInput = Omit<IProject, 'id' | 'createdAt'>;

export type CreateProjectInput = {
  input: ProjectInput;
};

export type UpdateProjectInput = {
  id: string;
  input: Partial<ProjectInput>;
};
