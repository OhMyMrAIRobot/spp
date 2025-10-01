import { Types } from 'mongoose';
import { ErrorMessages } from '../constants/errors';
import { ITask, Task } from '../models/task';
import { AppError } from '../types/http/error/app-error';
import {
  CreateTaskBody,
  UpdateTaskBody,
} from '../types/http/request/task.request';
import { JwtPayload } from '../types/jwt-payload';
import { TaskStatusEnum } from '../types/task/task-status';
import { ITaskWithUser } from '../types/task/task-with-user';
import { UserRoleEnum } from '../types/user/user-role';
import {
  ensureProjectMembership,
  toUserWithoutPassword,
} from '../utils/common';
import { projectService } from './project.service';
import { userService } from './user.service';

export const taskService = {
  getAll: async (): Promise<ITaskWithUser[]> => {
    const tasks = await Task.find().exec();

    const tasksWithUser = await Promise.all(
      tasks.map(async (t) => {
        const taskUser = await userService.getById(t.assignee);
        return { ...t.toJSON(), user: toUserWithoutPassword(taskUser) };
      }),
    );

    return tasksWithUser;
  },

  getById: async (id: string, user?: JwtPayload): Promise<ITaskWithUser> => {
    if (!Types.ObjectId.isValid(id))
      throw new AppError(ErrorMessages.INVALID_IDENTIFIER, 400);

    const task = await Task.findById(id).exec();

    if (!task) throw new AppError(ErrorMessages.TASK_NOT_FOUND, 404);

    if (user) {
      const project = await projectService.getById(task.projectId);
      ensureProjectMembership(project, user);
      taskService.ensureAccess(task, user);
    }

    const taskUser = await userService.getById(task.assignee);

    return { ...task.toJSON(), user: toUserWithoutPassword(taskUser) };
  },

  getByProjectId: async (
    projectId: string,
    user?: JwtPayload,
  ): Promise<ITask[]> => {
    if (!Types.ObjectId.isValid(projectId)) return [];

    const project = await projectService.getById(projectId);

    if (user) {
      ensureProjectMembership(project, user);
    }

    const tasks = await Task.find({
      projectId: new Types.ObjectId(projectId),
    }).exec();

    const tasksWithUser = await Promise.all(
      tasks.map(async (t) => {
        const taskUser = await userService.getById(t.assignee);
        return { ...t.toJSON(), user: toUserWithoutPassword(taskUser) };
      }),
    );

    return tasksWithUser;
  },

  create: async (
    data: CreateTaskBody,
    user?: JwtPayload,
  ): Promise<ITaskWithUser> => {
    if (!user) throw new AppError(ErrorMessages.UNAUTHORIZED, 401);

    await userService.getById(user.id);
    const project = await projectService.getById(data.projectId);
    ensureProjectMembership(project, user);

    const task = new Task({
      ...data,
      projectId: new Types.ObjectId(data.projectId),
      assignee: new Types.ObjectId(user.id),
    });

    task.save();

    const taskUser = await userService.getById(task.assignee);

    return { ...task.toJSON(), user: toUserWithoutPassword(taskUser) };
  },

  update: async (
    id: string,
    changes: UpdateTaskBody,
    user?: JwtPayload,
  ): Promise<ITaskWithUser> => {
    const task = await taskService.getById(id);

    if (user) {
      const project = await projectService.getById(task.projectId);
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

    return { ...updated.toJSON(), user: toUserWithoutPassword(taskUser) };
  },

  delete: async (id: string, user?: JwtPayload) => {
    const task = await taskService.getById(id);

    if (user) {
      const project = await projectService.getById(task.projectId);
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
