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

const cookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: 'lax' as const,
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

export const authController = {
  register: async (
    req: Request<{}, {}, RegisterRequest>,
    res: Response<ApiResponse<RegisterResponse>>,
    next: NextFunction,
  ) => {
    try {
      const { username, password } = req.body;

      const { accessToken, refreshToken, user } = await authService.register(
        username,
        password,
        UserRoleEnum.MEMBER,
      );

      res.cookie('refreshToken', refreshToken, cookieOptions);

      res.status(201).json({ data: { token: accessToken, user } });
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

      const { refreshToken, accessToken, user } = await authService.login(
        username,
        password,
      );

      res.cookie('refreshToken', refreshToken, cookieOptions);

      res.json({ data: { token: accessToken, user } });
    } catch (err) {
      next(err);
    }
  },

  refresh: async (
    req: Request,
    res: Response<ApiResponse<LoginResponse>>,
    next: NextFunction,
  ) => {
    try {
      const oldToken = req.cookies['refreshToken'];

      if (!oldToken) {
        throw new AppError(ErrorMessages.UNAUTHORIZED, 401);
      }

      const { accessToken, user, refreshToken } =
        await authService.refresh(oldToken);

      res.cookie('refreshToken', refreshToken, cookieOptions);

      res.json({ data: { token: accessToken, user } });
    } catch (err) {
      next(err);
    }
  },

  logout: async (req: IAuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError(ErrorMessages.UNAUTHORIZED, 401);
      }

      await authService.logout(req.user.id);

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax' as const,
      });

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
