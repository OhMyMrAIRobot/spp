import { Types } from 'mongoose';
import { ErrorMessages } from '../constants/errors';
import { ITask, Task } from '../models/task';
import { AppError } from '../types/http/error/app-error';
import {
  CreateTaskBody,
  UpdateTaskBody,
} from '../types/http/request/task.request';
import { ITaskResponse } from '../types/http/response/task.response';
import { JwtPayload } from '../types/jwt-payload';
import { TaskStatusEnum } from '../types/task/task-status';
import { UserRoleEnum } from '../types/user/user-role';
import {
  ensureProjectMembership,
  toPublicAttachment,
  toUserWithoutPassword,
} from '../utils/common';
import { attachmentService } from './attachment.service';
import { projectService } from './project.service';
import { userService } from './user.service';

export const taskService = {
  getAll: async (): Promise<ITaskResponse[]> => {
    const tasks = await Task.find().exec();

    const tasksExt = await Promise.all(
      tasks.map(async (t) => {
        const taskUser = await userService.getById(t.assignee);
        const taskAtt = await attachmentService.getByTaskId(t._id.toString());
        return {
          ...t.toJSON(),
          user: toUserWithoutPassword(taskUser),
          attachments: taskAtt.map((ta) => toPublicAttachment(ta)),
        };
      }),
    );

    return tasksExt;
  },

  getById: async (id: string, user?: JwtPayload): Promise<ITaskResponse> => {
    if (!Types.ObjectId.isValid(id))
      throw new AppError(ErrorMessages.INVALID_IDENTIFIER, 400);

    const task = await Task.findById(id).exec();
    if (!task) throw new AppError(ErrorMessages.TASK_NOT_FOUND, 404);

    if (user) {
      const project = await projectService.getByIdRaw(task.projectId);
      ensureProjectMembership(project, user);
      taskService.ensureAccess(task, user);
    }

    const taskUser = await userService.getById(task.assignee);
    const taskAtt = await attachmentService.getByTaskId(task.id);

    return {
      ...task.toJSON(),
      user: toUserWithoutPassword(taskUser),
      attachments: taskAtt.map((ta) => toPublicAttachment(ta)),
    };
  },

  getByIdRaw: async (id: string, user?: JwtPayload): Promise<ITask> => {
    if (!Types.ObjectId.isValid(id))
      throw new AppError(ErrorMessages.INVALID_IDENTIFIER, 400);

    const task = await Task.findById(id).exec();
    if (!task) throw new AppError(ErrorMessages.TASK_NOT_FOUND, 404);

    if (user) {
      const project = await projectService.getByIdRaw(task.projectId);
      ensureProjectMembership(project, user);
      taskService.ensureAccess(task, user);
    }

    return task.toJSON();
  },

  getByProjectId: async (
    projectId: string,
    user?: JwtPayload,
  ): Promise<ITaskResponse[]> => {
    if (!Types.ObjectId.isValid(projectId)) return [];

    const project = await projectService.getByIdRaw(projectId);

    if (user) {
      ensureProjectMembership(project, user);
    }

    const tasks = await Task.find({
      projectId: new Types.ObjectId(projectId),
    }).exec();

    const tasksExt = await Promise.all(
      tasks.map(async (t) => {
        const taskUser = await userService.getById(t.assignee);
        const taskAtt = await attachmentService.getByTaskId(t._id.toString());
        return {
          ...t.toJSON(),
          user: toUserWithoutPassword(taskUser),
          attachments: taskAtt.map((ta) => toPublicAttachment(ta)),
        };
      }),
    );

    return tasksExt;
  },

  create: async (
    data: CreateTaskBody,
    user?: JwtPayload,
  ): Promise<ITaskResponse> => {
    if (!user) throw new AppError(ErrorMessages.UNAUTHORIZED, 401);

    await userService.getById(user.id);
    const project = await projectService.getByIdRaw(data.projectId);
    ensureProjectMembership(project, user);

    const task = new Task({
      ...data,
      projectId: new Types.ObjectId(data.projectId),
      assignee: new Types.ObjectId(user.id),
    });

    task.save();

    const taskUser = await userService.getById(task.assignee);

    return {
      ...task.toJSON(),
      user: toUserWithoutPassword(taskUser),
      attachments: [],
    };
  },

  update: async (
    id: string,
    changes: UpdateTaskBody,
    user?: JwtPayload,
  ): Promise<ITaskResponse> => {
    const task = await taskService.getByIdRaw(id);

    if (user) {
      const project = await projectService.getByIdRaw(task.projectId);
      ensureProjectMembership(project, user);
      taskService.ensureAccess(task, user);
    }

    const updated = await Task.findByIdAndUpdate(id, changes, {
      new: true,
    }).exec();

    if (!updated) {
      throw new AppError(ErrorMessages.UPDATE_ERROR);
    }

    const taskUser = await userService.getById(updated.assignee);
    const taskAtt = await attachmentService.getByTaskId(task.id);

    return {
      ...updated.toJSON(),
      user: toUserWithoutPassword(taskUser),
      attachments: taskAtt.map((ta) => toPublicAttachment(ta)),
    };
  },

  delete: async (id: string, user?: JwtPayload) => {
    const task = await taskService.getByIdRaw(id);

    if (user) {
      const project = await projectService.getByIdRaw(task.projectId);
      ensureProjectMembership(project, user);
      taskService.ensureAccess(task, user);
    }

    const deleted = await Task.findByIdAndDelete(id).exec();

    if (!deleted) throw new AppError(ErrorMessages.DELETE_ERROR);

    return;
  },

  countByProject: async (projectId: string) => {
    const tasks = await Task.find({
      projectId: new Types.ObjectId(projectId),
    }).exec();

    return {
      TODO: tasks.filter((t) => t.status === TaskStatusEnum.TODO).length,
      IN_PROGRESS: tasks.filter((t) => t.status === TaskStatusEnum.IN_PROGRESS)
        .length,
      DONE: tasks.filter((t) => t.status === TaskStatusEnum.DONE).length,
    };
  },

  ensureAccess: (task: ITask, user: JwtPayload) => {
    if (user.role !== UserRoleEnum.ADMIN && task.assignee !== user.id) {
      throw new AppError(ErrorMessages.FORBIDDEN, 403);
    }
  },
};
