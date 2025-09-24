import mongoose, { Schema } from 'mongoose';
import { toJSONOptions } from '../../utils/common';
import { UserRoleEnum } from './user-role';

export interface IUser {
  _id?: string;
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
