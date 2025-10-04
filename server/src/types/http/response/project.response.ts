import { IProject } from '../../../models/project';

export interface IProjectResponse extends IProject {
  taskCounts: {
    TODO: number;
    IN_PROGRESS: number;
    DONE: number;
  };
}
