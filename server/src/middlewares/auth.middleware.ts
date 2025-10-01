import { NextFunction, Response } from 'express';
import { ErrorMessages } from '../constants/errors';
import { authService } from '../services/auth.service';
import { AppError } from '../types/http/error/app-error';
import { IAuthRequest } from '../types/http/request/auth.request';
import { UserRoleEnum } from '../types/user/user-role';

export const authenticate = (
  req: IAuthRequest,
  _res: Response,
  next: NextFunction,
) => {
  const header = req.headers['authorization'];
  if (!header) throw new AppError(ErrorMessages.UNAUTHORIZED, 401);

  const token = header.split(' ')[1];
  if (!token) throw new AppError(ErrorMessages.UNAUTHORIZED, 401);

  const payload = authService.verifyToken(token);
  req.user = payload;
  next();
};

export const authorize = (roles: UserRoleEnum[]) => {
  return (req: IAuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) throw new AppError(ErrorMessages.UNAUTHORIZED, 401);

    if (!roles.includes(req.user.role)) {
      throw new AppError(ErrorMessages.FORBIDDEN, 403);
    }
    next();
  };
};
