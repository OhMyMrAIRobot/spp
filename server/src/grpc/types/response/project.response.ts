export type GrpcTaskCounts = {
  todo: number;
  in_progress: number;
  done: number;
};

export interface GrpcProject {
  id: string;
  title: string;
  description: string;
  members: string[];
  created_at: string;
  task_counts: GrpcTaskCounts;
}

export type GetAllProjectsResponse = {
  projects: GrpcProject[];
};

export type GetProjectByIdResponse = {
  project: GrpcProject;
};

export type CreateProjectResponse = {
  project: GrpcProject;
};

export type UpdateProjectResponse = {
  project: GrpcProject;
};

export type DeleteProjectResponse = {};
