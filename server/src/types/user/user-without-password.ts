import { IUser } from '../../models/user';

export type UserWithoutPassword = Omit<IUser, 'passwordHash'>;
