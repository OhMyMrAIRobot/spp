import bcrypt from 'bcrypt';
import { ErrorMessages } from '../constants/errors';
import { User } from '../models/user';
import { AppError } from '../types/http/error/app-error';
import { JwtPayload } from '../types/jwt-payload';
import { UserRoleEnum } from '../types/user/user-role';
import { toUserWithoutPassword } from '../utils/common';
import { tokenService } from './token.service';
import { userService } from './user.service';

export const authService = {
  register: async (username: string, password: string, role: UserRoleEnum) => {
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await userService.create({
      username,
      passwordHash,
      role,
      refreshHash: null,
    });

    const payload: JwtPayload = { id: user.id, role: user.role } as const;
    const accessToken = tokenService.generateAccessToken(payload);
    const refreshToken = tokenService.generateRefreshToken(payload);

    await tokenService.saveRefreshToken(refreshToken, user.id);

    return { accessToken, refreshToken, user: toUserWithoutPassword(user) };
  },

  login: async (username: string, password: string) => {
    const dbuser = await User.findOne({
      username: { $regex: `^${username}$`, $options: 'i' },
    }).exec();
    if (!dbuser) throw new AppError(ErrorMessages.INVALID_CREDENTIALS, 401);

    const user = dbuser.toJSON();

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new AppError(ErrorMessages.INVALID_CREDENTIALS, 401);

    const payload: JwtPayload = { id: user.id, role: user.role } as const;
    const accessToken = tokenService.generateAccessToken(payload);
    const refreshToken = tokenService.generateRefreshToken(payload);

    await tokenService.saveRefreshToken(refreshToken, user.id);

    return { accessToken, refreshToken, user: toUserWithoutPassword(user) };
  },

  refresh: async (token: string) => {
    const decoded = await tokenService.verifyRefreshToken(token);

    const user = await userService.getById(decoded.id);

    const payload: JwtPayload = { id: user.id, role: user.role } as const;
    const accessToken = tokenService.generateAccessToken(payload);
    const refreshToken = tokenService.generateRefreshToken(payload);

    await tokenService.saveRefreshToken(refreshToken, user.id);

    return { accessToken, refreshToken, user: toUserWithoutPassword(user) };
  },

  logout: async (userId: string) => {
    return tokenService.deleteRefreshToken(userId);
  },
};
