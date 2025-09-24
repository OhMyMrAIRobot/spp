import { Types } from 'mongoose';
import { ErrorMessages } from '../constants/errors';
import { ITask, Task } from '../models/task/task';
import { AppError } from '../types/http/error/app-error';
import {
  CreateTaskBody,
  UpdateTaskBody,
} from '../types/http/request/task.request';
import { projectService } from './project.service';
import { userService } from './user.service';

export const taskService = {
  getAll: async (): Promise<ITask[]> => Task.find().exec(),

  getById: async (id: string): Promise<ITask> => {
    if (!Types.ObjectId.isValid(id))
      throw new AppError(ErrorMessages.INVALID_IDENTIFIER, 400);

    const task = await Task.findById(id).exec();

    if (!task) throw new AppError(ErrorMessages.TASK_NOT_FOUND, 404);

    return task;
  },

  getByProjectId: async (projectId: string): Promise<ITask[]> => {
    if (!Types.ObjectId.isValid(projectId)) return [];

    return Task.find({ projectId: new Types.ObjectId(projectId) }).exec();
  },

  create: async (data: CreateTaskBody): Promise<ITask> => {
    // TODO: раскомментить позже
    // await userService.getById(data.assignee.toString());
    await projectService.getById(data.projectId.toString());

    const task = new Task({
      ...data,
      projectId: new Types.ObjectId(data.projectId),
      // assignee: new Types.ObjectId(data.assignee),
      assignee: new Types.ObjectId('68d43c2d20a45afccfba8d8d'), // заглушка до 6ой лабы
    });

    return task.save();
  },

  update: async (id: string, changes: UpdateTaskBody): Promise<ITask> => {
    await taskService.getById(id);

    if (changes.assignee) {
      await userService.getById(changes.assignee.toString());
      changes.assignee = new Types.ObjectId(changes.assignee);
    }

    if (changes.projectId) {
      await projectService.getById(changes.projectId.toString());
      changes.projectId = new Types.ObjectId(changes.projectId);
    }

    const updated = await Task.findByIdAndUpdate(id, changes, {
      new: true,
    }).exec();

    if (!updated) {
      throw new AppError(ErrorMessages.UPDATE_ERROR);
    }

    return updated;
  },

  delete: async (id: string) => {
    await taskService.getById(id);

    const deleted = await Task.findByIdAndDelete(id).exec();

    if (!deleted) throw new AppError(ErrorMessages.DELETE_ERROR);

    return;
  },

  countByProject: async (projectId: string) => {
    const tasks = await Task.find({
      projectId: new Types.ObjectId(projectId),
    }).exec();

    return {
      TODO: tasks.filter((t) => t.status === 'TODO').length,
      IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
      DONE: tasks.filter((t) => t.status === 'DONE').length,
    };
  },
};
