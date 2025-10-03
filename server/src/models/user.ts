import mongoose, { Schema } from 'mongoose';
import { UserRoleEnum } from '../types/user/user-role';
import { toJSONOptions } from '../utils/common';

export interface IUser {
  id: string;
  username: string;
  passwordHash: string;
  refreshHash: string | null;
  role: UserRoleEnum;
}

const UserSchema: Schema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot exceed 20 characters'],
    match: [
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers and underscores',
    ],
  },
  passwordHash: {
    type: String,
    required: [true, 'Password hash is required'],
  },
  refreshHash: {
    type: String,
    default: null,
    required: false,
  },
  role: {
    type: String,
    enum: Object.values(UserRoleEnum),
    default: UserRoleEnum.MEMBER,
  },
});

UserSchema.set('toJSON', toJSONOptions);

export const User = mongoose.model<IUser>('User', UserSchema);
