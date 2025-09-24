export type ProjectParams = {
  id: string;
};

export type CreateProjectBody = {
  title: string;
};

export type UpdateProjectBody = Partial<CreateProjectBody>;
