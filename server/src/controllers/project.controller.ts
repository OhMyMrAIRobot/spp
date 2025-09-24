import { NextFunction, Request, Response } from 'express';
import { ErrorMessages } from '../constants/errors';
import { IProjectWithStats } from '../models/project/project-with-stats';
import { projectService } from '../services/project.service';
import { AppError } from '../types/http/error/app-error';
import {
  CreateProjectBody,
  ProjectParams,
  UpdateProjectBody,
} from '../types/http/request/project.request';
import { ApiResponse } from '../types/http/response/api.response';

export const projectController = {
  getAll: (
    req: Request,
    res: Response<ApiResponse<IProjectWithStats[]>>,
    next: NextFunction,
  ): void => {
    try {
      const projects = projectService.getAll();

      res.json({ data: projects });
    } catch (err) {
      next(err);
    }
  },

  getById: (
    req: Request<ProjectParams>,
    res: Response<ApiResponse<IProjectWithStats>>,
    next: NextFunction,
  ): void => {
    try {
      const { id } = req.params;

      const project = projectService.getById(id);
      if (!project) throw new AppError(ErrorMessages.PROJECT_NOT_FOUND, 404);

      res.json({ data: project });
    } catch (err) {
      next(err);
    }
  },

  create: (
    req: Request<{}, {}, CreateProjectBody>,
    res: Response<ApiResponse<IProjectWithStats>>,
    next: NextFunction,
  ): void => {
    try {
      const newProject = projectService.create(req.body);

      res.status(201).json({ data: newProject });
    } catch (err) {
      next(err);
    }
  },

  update: (
    req: Request<ProjectParams, {}, UpdateProjectBody>,
    res: Response<ApiResponse<IProjectWithStats>>,
    next: NextFunction,
  ): void => {
    try {
      const { id } = req.params;

      const updated = projectService.update(id, req.body);
      if (!updated) throw new AppError(ErrorMessages.UPDATE_ERROR);

      res.json({ data: updated });
    } catch (err) {
      next(err);
    }
  },

  delete: (
    req: Request<ProjectParams>,
    res: Response<ApiResponse<null>>,
    next: NextFunction,
  ): void => {
    try {
      const deleted = projectService.delete(req.params.id);

      if (!deleted) throw new AppError(ErrorMessages.DELETE_ERROR);
      res.status(204).json({ data: null });
    } catch (err) {
      next(err);
    }
  },
};
