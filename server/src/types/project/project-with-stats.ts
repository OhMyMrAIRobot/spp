import { IProject } from '../../models/project';

export interface IProjectWithStats extends IProject {
  taskCounts: {
    TODO: number;
    IN_PROGRESS: number;
    DONE: number;
  };
}
