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
  getAll: (
    req: Request,
    res: Response<ApiResponse<ITask[]>>,
    next: NextFunction,
  ): void => {
    try {
      const tasks = taskService.getAll();
      res.json({ data: tasks });
    } catch (err) {
      next(err);
    }
  },

  getById: (
    req: Request<TaskParams>,
    res: Response<ApiResponse<ITask>>,
    next: NextFunction,
  ): void => {
    try {
      const task = taskService.getById(req.params.id);
      if (!task) throw new AppError(ErrorMessages.TASK_NOT_FOUND, 404);

      res.json({ data: task });
    } catch (err) {
      next(err);
    }
  },

  getByProject: (
    req: Request<Pick<TaskParams, 'projectId'>>,
    res: Response<ApiResponse<ITask[]>>,
    next: NextFunction,
  ): void => {
    try {
      const tasks = taskService.getByProjectId(req.params.projectId);
      res.json({ data: tasks });
    } catch (err) {
      next(err);
    }
  },

  create: (
    req: Request<{}, {}, CreateTaskBody>,
    res: Response<ApiResponse<ITask>>,
    next: NextFunction,
  ): void => {
    try {
      const newTask = taskService.create(req.body);

      res.status(201).json({ data: newTask });
    } catch (err) {
      next(err);
    }
  },

  update: (
    req: Request<TaskParams, {}, UpdateTaskBody>,
    res: Response<ApiResponse<ITask>>,
    next: NextFunction,
  ): void => {
    try {
      const updated = taskService.update(req.params.id, req.body);
      if (!updated) throw new AppError(ErrorMessages.UPDATE_ERROR);
      res.json({ data: updated });
    } catch (err) {
      next(err);
    }
  },

  delete: (
    req: Request<TaskParams>,
    res: Response<ApiResponse<null>>,
    next: NextFunction,
  ): void => {
    try {
      const deleted = taskService.delete(req.params.id);
      if (!deleted) throw new AppError(ErrorMessages.DELETE_ERROR);
      res.status(204).json({ data: null });
    } catch (err) {
      next(err);
    }
  },
};
