import { NextFunction, Response } from 'express';
import { userService } from '../services/user.service';
import { IAuthRequest } from '../types/http/request/auth.request';
import { ApiResponse } from '../types/http/response/api.response';
import { UserWithoutPassword } from '../types/user/user-without-password';
import { toUserWithoutPassword } from '../utils/common';

export const userController = {
  getAll: async (
    req: IAuthRequest,
    res: Response<ApiResponse<UserWithoutPassword[]>>,
    next: NextFunction,
  ) => {
    try {
      const users = await userService.getAll();

      res.json({ data: users.map((u) => toUserWithoutPassword(u)) });
    } catch (err) {
      next(err);
    }
  },
};
