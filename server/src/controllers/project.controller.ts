import { NextFunction, Request, Response } from 'express';
import { IProjectWithStats } from '../models/project/project-with-stats';
import { projectService } from '../services/project.service';
import {
  CreateProjectBody,
  ProjectParams,
  UpdateProjectBody,
} from '../types/http/request/project.request';
import { ApiResponse } from '../types/http/response/api.response';

export const projectController = {
  getAll: async (
    req: Request,
    res: Response<ApiResponse<IProjectWithStats[]>>,
    next: NextFunction,
  ) => {
    try {
      const projects = await projectService.getAll();

      res.json({ data: projects });
    } catch (err) {
      next(err);
    }
  },

  getById: async (
    req: Request<ProjectParams>,
    res: Response<ApiResponse<IProjectWithStats>>,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;

      const project = await projectService.getById(id);

      res.json({ data: project });
    } catch (err) {
      next(err);
    }
  },

  create: async (
    req: Request<{}, {}, CreateProjectBody>,
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
    req: Request<ProjectParams, {}, UpdateProjectBody>,
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
    req: Request<ProjectParams>,
    res: Response<ApiResponse<null>>,
    next: NextFunction,
  ) => {
    try {
      await projectService.delete(req.params.id);

      res.status(204).json({ data: null });
    } catch (err) {
      next(err);
    }
  },
};
