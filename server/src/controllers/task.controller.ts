import { NextFunction, Response } from 'express';
import { ITask } from '../models/task';
import { taskService } from '../services/task.serivice';
import { IAuthRequest } from '../types/http/request/auth.request';
import {
  CreateTaskBody,
  TaskParams,
  UpdateTaskBody,
} from '../types/http/request/task.request';
import { ApiResponse } from '../types/http/response/api.response';

export const taskController = {
  getAll: async (
    req: IAuthRequest,
    res: Response<ApiResponse<ITask[]>>,
    next: NextFunction,
  ) => {
    try {
      const tasks = await taskService.getAll();

      res.json({ data: tasks });
    } catch (err) {
      next(err);
    }
  },

  getById: async (
    req: IAuthRequest<TaskParams>,
    res: Response<ApiResponse<ITask>>,
    next: NextFunction,
  ) => {
    try {
      const task = await taskService.getById(req.params.id, req.user);

      res.json({ data: task });
    } catch (err) {
      next(err);
    }
  },

  getByProject: async (
    req: IAuthRequest<Pick<TaskParams, 'projectId'>>,
    res: Response<ApiResponse<ITask[]>>,
    next: NextFunction,
  ) => {
    try {
      const tasks = await taskService.getByProjectId(
        req.params.projectId,
        req.user,
      );

      res.json({ data: tasks });
    } catch (err) {
      next(err);
    }
  },

  create: async (
    req: IAuthRequest<{}, {}, CreateTaskBody>,
    res: Response<ApiResponse<ITask>>,
    next: NextFunction,
  ) => {
    try {
      const newTask = await taskService.create(req.body, req.user);

      res.status(201).json({ data: newTask });
    } catch (err) {
      next(err);
    }
  },

  update: async (
    req: IAuthRequest<TaskParams, {}, UpdateTaskBody>,
    res: Response<ApiResponse<ITask>>,
    next: NextFunction,
  ) => {
    try {
      const updated = await taskService.update(
        req.params.id,
        req.body,
        req.user,
      );

      res.json({ data: updated });
    } catch (err) {
      next(err);
    }
  },

  delete: async (
    req: IAuthRequest<TaskParams>,
    res: Response<ApiResponse<null>>,
    next: NextFunction,
  ) => {
    try {
      await taskService.delete(req.params.id, req.user);

      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },
};
