import { Types } from 'mongoose';
import { ErrorMessages } from '../constants/error-messages';
import { UserInput } from '../graphql/inputs/user.inputs';
import { IUser, User } from '../models/user';

export const userService = {
  getAll: async (): Promise<IUser[]> => User.find().exec(),

  getById: async (id: string): Promise<IUser> => {
    if (!Types.ObjectId.isValid(id))
      throw new Error(ErrorMessages.INVALID_IDENTIFIER);

    const user = await User.findById(id).exec();

    if (!user) throw new Error(ErrorMessages.USER_NOT_FOUND);

    return user.toJSON();
  },

  create: async (data: UserInput): Promise<IUser> => {
    await userService.ensureUniqueUsername(data.username);

    const user = new User({
      username: data.username,
      passwordHash: data.passwordHash,
      role: data.role,
    });

    return (await user.save()).toJSON();
  },

  update: async (id: string, changes: Partial<UserInput>): Promise<IUser> => {
    await userService.getById(id);

    if (changes.username) {
      await userService.ensureUniqueUsername(changes.username, id);
    }

    const updated = await User.findByIdAndUpdate(id, changes, {
      new: true,
    }).exec();

    if (!updated) throw new Error(ErrorMessages.FAILED_UPDATE_USER);

    return updated.toJSON();
  },

  delete: async (id: string) => {
    await userService.getById(id);

    const deleted = await User.findByIdAndDelete(id).exec();

    if (!deleted) throw new Error(ErrorMessages.FAILER_DELETE_USER);

    return;
  },

  async ensureUniqueUsername(username: string, excludeId?: string) {
    const existing = await User.findOne({
      username: { $regex: new RegExp(`^${username}$`, 'i') },
    }).exec();

    if (existing && existing._id.toString() !== excludeId) {
      throw new Error(ErrorMessages.DUPLICATE_USERNAME + existing.username);
    }
  },
};
