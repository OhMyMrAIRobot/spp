import { Types } from 'mongoose';
import { ErrorMessages } from '../constants/error-messages';
import { TaskInput } from '../graphql/inputs/task.inputs';
import { ITask, Task } from '../models/task';
import { JwtPayload } from '../types/jwt-payload';
import { TaskStatusEnum } from '../types/task-status';
import { UserRoleEnum } from '../types/user/user-role';
import { ensureProjectMembership } from '../utils/common';
import { projectService } from './project.service';
import { userService } from './user.service';

export const taskService = {
  getAllRaw: async (): Promise<ITask[]> => {
    const tasks = await Task.find().exec();
    return tasks.map((t) => t.toJSON());
  },

  getByIdRaw: async (id: string, user?: JwtPayload): Promise<ITask> => {
    if (!Types.ObjectId.isValid(id))
      throw new Error(ErrorMessages.INVALID_IDENTIFIER);

    const task = await Task.findById(id).exec();
    if (!task) throw new Error(ErrorMessages.TASK_NOT_FOUND);

    if (user) {
      const project = await projectService.getByIdRaw(task.projectId);
      ensureProjectMembership(project, user);
      taskService.ensureAccess(task.toJSON(), user);
    }

    return task.toJSON();
  },

  getByProjectIdRaw: async (projectId: string): Promise<ITask[]> => {
    if (!Types.ObjectId.isValid(projectId)) return [];

    const tasks = await Task.find({
      projectId: new Types.ObjectId(projectId),
    }).exec();

    return tasks.map((t) => t.toJSON());
  },

  create: async (data: TaskInput, user?: JwtPayload): Promise<ITask> => {
    if (!user) throw new Error(ErrorMessages.UNAUTHORIZED);

    await userService.getById(user.id);
    const project = await projectService.getByIdRaw(data.projectId);
    ensureProjectMembership(project, user);

    const task = new Task({
      ...data,
      projectId: new Types.ObjectId(data.projectId),
      assignee: new Types.ObjectId(user.id),
    });

    await task.save();
    return task.toJSON();
  },

  update: async (
    id: string,
    changes: Partial<TaskInput>,
    user?: JwtPayload,
  ): Promise<ITask> => {
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
      throw new Error(ErrorMessages.FAILED_UPDATE_TASK);
    }

    return updated.toJSON();
  },

  delete: async (id: string, user?: JwtPayload) => {
    const task = await taskService.getByIdRaw(id);

    if (user) {
      const project = await projectService.getByIdRaw(task.projectId);
      ensureProjectMembership(project, user);
      taskService.ensureAccess(task, user);
    }

    const deleted = await Task.findByIdAndDelete(id).exec();

    if (!deleted) throw new Error(ErrorMessages.FAILER_DELETE_TASK);

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
      throw new Error(ErrorMessages.FORBIDDEN);
    }
  },
};
