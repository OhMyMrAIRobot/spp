import { ITask } from '../../../models/task';
import { PublicAttachment } from '../../attachment/public-attachment';
import { UserWithoutPassword } from '../../user/user-without-password';

export interface ITaskResponse extends ITask {
  user: UserWithoutPassword;
  attachments: PublicAttachment[];
}
