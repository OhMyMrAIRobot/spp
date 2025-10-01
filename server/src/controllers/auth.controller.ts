import { NextFunction, Request, Response } from 'express';
import { ErrorMessages } from '../constants/errors';
import { authService } from '../services/auth.service';
import { AppError } from '../types/http/error/app-error';
import { IAuthRequest } from '../types/http/request/auth.request';
import { LoginRequest } from '../types/http/request/login.request';
import { RegisterRequest } from '../types/http/request/register.request';
import { ApiResponse } from '../types/http/response/api.response';
import { LoginResponse } from '../types/http/response/login.response';
import { RegisterResponse } from '../types/http/response/register.response';
import { UserRoleEnum } from '../types/user/user-role';

export const authController = {
  register: async (
    req: Request<{}, {}, RegisterRequest>,
    res: Response<ApiResponse<RegisterResponse>>,
    next: NextFunction,
  ) => {
    try {
      const { username, password } = req.body;

      const { token, user } = await authService.register(
        username,
        password,
        UserRoleEnum.MEMBER,
      );

      res.json({ data: { token, user } });
    } catch (err) {
      next(err);
    }
  },

  login: async (
    req: Request<{}, {}, LoginRequest>,
    res: Response<ApiResponse<LoginResponse>>,
    next: NextFunction,
  ) => {
    try {
      const { username, password } = req.body;

      const { token, user } = await authService.login(username, password);

      res.json({ data: { token, user } });
    } catch (err) {
      next(err);
    }
  },

  isAuth: async (
    req: IAuthRequest,
    res: Response<ApiResponse<LoginResponse>>,
    next: NextFunction,
  ) => {
    try {
      if (!req.user) {
        throw new AppError(ErrorMessages.UNAUTHORIZED, 401);
      }

      const { token, user } = await authService.reAuth(req.user.id);

      res.json({ data: { token, user } });
    } catch (err) {
      next(err);
    }
  },
};
