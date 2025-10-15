import { IUser } from '../../models/user';

export type UserInput = Omit<IUser, 'id' | 'createdAt'>;
