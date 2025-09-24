import { NextFunction, Request, Response } from 'express';
import { AppError } from '../types/http/error/app-error';
import { ApiResponse } from '../types/http/response/api.response';

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response<ApiResponse<null>>,
  next: NextFunction,
) => {
  res.status(err.status).json({
    message: err.message,
  });
};
