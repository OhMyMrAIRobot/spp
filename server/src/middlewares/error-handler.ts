import { NextFunction, Request, Response } from 'express';
import { AppError } from '../types/http/error/app-error';
import { ApiResponse } from '../types/http/response/api.response';

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response<ApiResponse<null>>,
  next: NextFunction,
) => {
  console.log(err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error!',
  });
};
