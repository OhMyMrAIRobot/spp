import { NextFunction, Request, Response } from 'express';
import { ErrorMessages } from '../constants/errors';
import { ITask } from '../models/task/task';
import { taskService } from '../services/task.serivice';
import { AppError } from '../types/http/error/app-error';
import {
  CreateTaskBody,
  TaskParams,
  UpdateTaskBody,
} from '../types/http/request/task.request';
import { ApiResponse } from '../types/http/response/api.response';

export const taskController = {
  getAll: async (
    req: Request,
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
    req: Request<TaskParams>,
    res: Response<ApiResponse<ITask>>,
    next: NextFunction,
  ) => {
    try {
      const task = await taskService.getById(req.params.id);

      if (!task) throw new AppError(ErrorMessages.TASK_NOT_FOUND, 404);

      res.json({ data: task });
    } catch (err) {
      next(err);
    }
  },

  getByProject: async (
    req: Request<Pick<TaskParams, 'projectId'>>,
    res: Response<ApiResponse<ITask[]>>,
    next: NextFunction,
  ) => {
    try {
      const tasks = await taskService.getByProjectId(req.params.projectId);

      res.json({ data: tasks });
    } catch (err) {
      next(err);
    }
  },

  create: async (
    req: Request<{}, {}, CreateTaskBody>,
    res: Response<ApiResponse<ITask>>,
    next: NextFunction,
  ) => {
    try {
      const newTask = await taskService.create(req.body);

      res.status(201).json({ data: newTask });
    } catch (err) {
      next(err);
    }
  },

  update: async (
    req: Request<TaskParams, {}, UpdateTaskBody>,
    res: Response<ApiResponse<ITask>>,
    next: NextFunction,
  ) => {
    try {
      const updated = await taskService.update(req.params.id, req.body);

      res.json({ data: updated });
    } catch (err) {
      next(err);
    }
  },

  delete: async (
    req: Request<TaskParams>,
    res: Response<ApiResponse<null>>,
    next: NextFunction,
  ) => {
    try {
      await taskService.delete(req.params.id);

      res.status(204).json({ data: null });
    } catch (err) {
      next(err);
    }
  },
};
