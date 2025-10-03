import { NextFunction, Response } from 'express';
import { projectService } from '../services/project.service';
import { IAuthRequest } from '../types/http/request/auth.request';
import {
  CreateProjectBody,
  ProjectParams,
  UpdateProjectBody,
} from '../types/http/request/project.request';
import { ApiResponse } from '../types/http/response/api.response';
import { IProjectWithStats } from '../types/project/project-with-stats';

export const projectController = {
  getAll: async (
    req: IAuthRequest,
    res: Response<ApiResponse<IProjectWithStats[]>>,
    next: NextFunction,
  ) => {
    try {
      const projects = await projectService.getAll(req.user);

      res.json({ data: projects });
    } catch (err) {
      next(err);
    }
  },

  getById: async (
    req: IAuthRequest<ProjectParams>,
    res: Response<ApiResponse<IProjectWithStats>>,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;

      const project = await projectService.getById(id, req.user);

      res.json({ data: project });
    } catch (err) {
      next(err);
    }
  },

  create: async (
    req: IAuthRequest<{}, {}, CreateProjectBody>,
    res: Response<ApiResponse<IProjectWithStats>>,
    next: NextFunction,
  ) => {
    try {
      const newProject = await projectService.create(req.body);

      res.status(201).json({ data: newProject });
    } catch (err) {
      next(err);
    }
  },

  update: async (
    req: IAuthRequest<ProjectParams, {}, UpdateProjectBody>,
    res: Response<ApiResponse<IProjectWithStats>>,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;

      const updated = await projectService.update(id, req.body);

      res.json({ data: updated });
    } catch (err) {
      next(err);
    }
  },

  delete: async (
    req: IAuthRequest<ProjectParams>,
    res: Response<ApiResponse<null>>,
    next: NextFunction,
  ) => {
    try {
      await projectService.delete(req.params.id);

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
