export type ApiResponse<T> = {
  data?: T;
  message?: string;
  errors?: {
    path: string;
    message: string;
  }[];
};
