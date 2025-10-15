import { Types } from 'mongoose';
import { ErrorMessages } from '../constants/error-messages';
import { IProject } from '../models/project';
import { IUser } from '../models/user';
import { JwtPayload } from '../types/jwt-payload';
import { UserRoleEnum } from '../types/user/user-role';
import { UserWithoutPassword } from '../types/user/user-without-password';

const convertObjectIds = (obj: any): any => {
  if (obj instanceof Types.ObjectId) {
    return obj.toString();
  }

  if (Array.isArray(obj)) {
    return obj.map(convertObjectIds);
  }

  if (obj && typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      obj[key] = convertObjectIds(obj[key]);
    }
  }

  return obj;
};

export const toJSONOptions = {
  transform: (_doc: any, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return convertObjectIds(ret);
  },
};

export const toUserWithoutPassword = (user: IUser): UserWithoutPassword => {
  return {
    id: user.id,
    username: user.username,
    role: user.role,
  };
};

export const ensureProjectMembership = (
  project: IProject,
  user: JwtPayload,
) => {
  if (user.role === UserRoleEnum.ADMIN) return;

  const isMember = project.members.some((m) => m === user.id);

  if (!isMember) {
    throw new Error(ErrorMessages.FORBIDDEN);
  }
};
