import { Types } from 'mongoose';
import { ErrorMessages } from '../constants/errors';
import { IUser, User } from '../models/user';
import { AppError } from '../types/http/error/app-error';
import {
  CreateUserBody,
  UpdateUserBody,
} from '../types/http/request/user.request';

export const userService = {
  getAll: async (): Promise<IUser[]> => User.find().exec(),

  getById: async (id: string): Promise<IUser> => {
    if (!Types.ObjectId.isValid(id))
      throw new AppError(ErrorMessages.INVALID_IDENTIFIER, 400);

    const user = await User.findById(id).exec();

    if (!user) throw new AppError(ErrorMessages.USER_NOT_FOUND, 404);

    return user.toJSON();
  },

  create: async (data: CreateUserBody): Promise<IUser> => {
    await userService.ensureUniqueUsername(data.username);

    const user = new User({
      username: data.username,
      passwordHash: data.passwordHash,
      role: data.role,
    });

    return (await user.save()).toJSON();
  },

  update: async (id: string, changes: UpdateUserBody): Promise<IUser> => {
    await userService.getById(id);

    if (changes.username) {
      await userService.ensureUniqueUsername(changes.username, id);
    }

    const updated = await User.findByIdAndUpdate(id, changes, {
      new: true,
    }).exec();

    if (!updated) throw new AppError(ErrorMessages.UPDATE_ERROR);

    return updated.toJSON();
  },

  delete: async (id: string) => {
    await userService.getById(id);

    const deleted = await User.findByIdAndDelete(id).exec();

    if (!deleted) throw new AppError(ErrorMessages.DELETE_ERROR);

    return;
  },

  async ensureUniqueUsername(username: string, excludeId?: string) {
    const existing = await User.findOne({
      username: { $regex: new RegExp(`^${username}$`, 'i') },
    }).exec();

    if (existing && existing._id.toString() !== excludeId) {
      throw new AppError(
        ErrorMessages.DUPLICATE_USERNAME + existing.username,
        400,
      );
    }
  },
};
