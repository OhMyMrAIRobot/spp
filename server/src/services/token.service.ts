import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ErrorMessages } from '../constants/error-messages';
import { AppError } from '../types/http/error/app-error';
import { JwtPayload } from '../types/jwt-payload';
import { userService } from './user.service';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'accesssecret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refreshsecret';
const JWT_ACCESS_EXPIRES_IN = '10s';
const JWT_REFRESH_EXPIRES_IN = '30d';

export const tokenService = {
  generateAccessToken: (payload: JwtPayload) => {
    return jwt.sign(payload, JWT_ACCESS_SECRET, {
      expiresIn: JWT_ACCESS_EXPIRES_IN,
    });
  },

  generateRefreshToken: (payload: JwtPayload) => {
    return jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
    });
  },

  verifyAccessToken: (token: string): JwtPayload => {
    try {
      return jwt.verify(token, JWT_ACCESS_SECRET) as JwtPayload;
    } catch {
      throw new AppError(ErrorMessages.UNAUTHORIZED, 401);
    }
  },

  verifyRefreshToken: async (token: string): Promise<JwtPayload> => {
    try {
      const payload = jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;

      const user = await userService.getById(payload.id);

      if (!user.refreshHash) {
        throw new Error(ErrorMessages.UNAUTHORIZED);
      }

      const isValid = await bcrypt.compare(token, user.refreshHash);
      if (!isValid) {
        throw new Error(ErrorMessages.UNAUTHORIZED);
      }

      return payload;
    } catch {
      throw new Error(ErrorMessages.UNAUTHORIZED);
    }
  },

  saveRefreshToken: async (token: string, userId: string) => {
    const refreshHash = await bcrypt.hash(token, 10);
    await userService.update(userId, { refreshHash });
    return;
  },

  deleteRefreshToken: async (userId: string) => {
    await userService.update(userId, { refreshHash: null });
  },
};
