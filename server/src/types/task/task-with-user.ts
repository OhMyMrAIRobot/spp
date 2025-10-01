import { ITask } from '../../models/task';
import { UserWithoutPassword } from '../user/user-without-password';

export interface ITaskWithUser extends ITask {
  user: UserWithoutPassword;
}
