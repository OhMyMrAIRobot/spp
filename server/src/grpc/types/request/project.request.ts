export type GetAllProjectsRequest = {};

export type GetProjectByIdRequest = {
  id: string;
};

export type CreateProjectRequest = {
  title: string;
  description: string;
  members?: string[];
};

export type UpdateProjectRequest = {
  id: string;
  title?: string;
  description?: string;
  members?: string[];
};

export type DeleteProjectRequest = {
  id: string;
};
