import { IProject } from '../../models/project';

export interface IProjectWithTaskCounts extends IProject {
  taskCounts: {
    TODO: number;
    IN_PROGRESS: number;
    DONE: number;
  };
}
