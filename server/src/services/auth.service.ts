import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ErrorMessages } from '../constants/errors';
import { User } from '../models/user';
import { AppError } from '../types/http/error/app-error';
import { LoginResponse } from '../types/http/response/login.response';
import { JwtPayload } from '../types/jwt-payload';
import { UserRoleEnum } from '../types/user/user-role';
import { toUserWithoutPassword } from '../utils/common';
import { userService } from './user.service';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const JWT_EXPIRES_IN = '1h';

export const authService = {
  register: async (
    username: string,
    password: string,
    role: UserRoleEnum,
  ): Promise<LoginResponse> => {
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await userService.create({ username, passwordHash, role });

    return authService.login(user.username, password);
  },

  login: async (username: string, password: string): Promise<LoginResponse> => {
    const user = await User.findOne({
      username: { $regex: `^${username}$`, $options: 'i' },
    }).exec();
    if (!user) throw new AppError(ErrorMessages.INVALID_CREDENTIALS, 401);

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new AppError(ErrorMessages.INVALID_CREDENTIALS, 401);

    const payload: JwtPayload = { id: user.id, role: user.role } as const;

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return { token, user: toUserWithoutPassword(user) };
  },

  reAuth: async (userId: string): Promise<LoginResponse> => {
    const user = await User.findOne({ _id: userId }).exec();
    if (!user) throw new AppError(ErrorMessages.INVALID_CREDENTIALS, 401);

    const payload: JwtPayload = { id: user.id, role: user.role } as const;

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return { token, user: toUserWithoutPassword(user) };
  },

  verifyToken: (token: string): JwtPayload => {
    try {
      return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch {
      throw new AppError(ErrorMessages.UNAUTHORIZED, 401);
    }
  },
};
