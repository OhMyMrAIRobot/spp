import mongoose, { Schema } from 'mongoose';
import { UserRoleEnum } from '../types/user/user-role';
import { toJSONOptions } from '../utils/common';

export interface IUser {
  id: string;
  username: string;
  passwordHash: string;
  role: UserRoleEnum;
}

const UserSchema: Schema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: Object.values(UserRoleEnum),
    default: UserRoleEnum.MEMBER,
  },
});

UserSchema.set('toJSON', toJSONOptions);

export const User = mongoose.model<IUser>('User', UserSchema);
