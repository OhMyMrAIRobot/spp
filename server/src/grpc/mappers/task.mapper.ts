import { ITaskExtended } from '../../types/task/task-extended';
import { TaskStatusEnum } from '../../types/task/task-status';
import { toGrpcAttachment } from './attachment.mapper';
import { toGrpcUser } from './user.mapper';

export function toGrpcTaskStatus(status: TaskStatusEnum): number {
  switch (status) {
    case 'TODO':
      return 1;
    case 'IN_PROGRESS':
      return 2;
    case 'DONE':
      return 3;
    default:
      return 0;
  }
}

export function fromGrpcTaskStatus(status: number): TaskStatusEnum {
  switch (status) {
    case 1:
      return 'TODO';
    case 2:
      return 'IN_PROGRESS';
    case 3:
      return 'DONE';
    default:
      return 'TODO';
  }
}

export function toGrpcTask(task: ITaskExtended) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: toGrpcTaskStatus(task.status),
    assignee: task.assignee,
    createdAt: task.createdAt,
    dueDate: task.dueDate || undefined,
    projectId: task.projectId,
    user: toGrpcUser(task.user),
    attachments: task.attachments.map(toGrpcAttachment),
  };
}
