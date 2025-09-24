import { IProject } from './project';

export interface IProjectWithStats extends IProject {
  taskCounts: {
    TODO: number;
    IN_PROGRESS: number;
    DONE: number;
  };
}
