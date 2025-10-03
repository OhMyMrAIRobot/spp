import { IUser } from '../../../models/user';

export type CreateUserBody = Omit<IUser, 'id' | 'createdAt'>;

export type UpdateUserBody = Partial<CreateUserBody>;
