import { IUser } from '../../models/user';

export type CreateUserData = Omit<IUser, 'id' | 'createdAt'>;
