import { Types } from 'mongoose';
import { ErrorMessages } from '../constants/errors';
import { Project } from '../models/project/project';
import { IProjectWithStats } from '../models/project/project-with-stats';
import { User } from '../models/user/user';
import { AppError } from '../types/http/error/app-error';
import {
  CreateProjectBody,
  UpdateProjectBody,
} from '../types/http/request/project.request';
import { taskService } from './task.serivice';

export const projectService = {
  getAll: async (): Promise<IProjectWithStats[]> => {
    const projects = await Project.find().exec();
    const projectsWithStats: IProjectWithStats[] = [];

    for (const p of projects) {
      projectsWithStats.push({
        ...p.toJSON(),
        taskCounts: await taskService.countByProject(p._id!.toString()),
      });
    }

    return projectsWithStats;
  },

  getById: async (id: string): Promise<IProjectWithStats> => {
    if (!Types.ObjectId.isValid(id))
      throw new AppError(ErrorMessages.INVALID_IDENTIFIER, 400);

    const project = await Project.findById(id).exec();

    if (!project) throw new AppError(ErrorMessages.PROJECT_NOT_FOUND, 404);

    return {
      ...project.toJSON(),
      taskCounts: await taskService.countByProject(id),
    };
  },

  create: async (body: CreateProjectBody): Promise<IProjectWithStats> => {
    const members =
      body.members?.filter((id) => Types.ObjectId.isValid(id)) || [];

    if (members.length > 0) {
      const existingUsers = await User.find({
        _id: { $in: members },
      }).select('_id');

      const existingIds = existingUsers.map((u) => u._id.toString());

      const invalidIds = members.filter(
        (id) => !existingIds.includes(id.toString()),
      );
      if (invalidIds.length > 0) {
        throw new AppError(`Members not found: ${invalidIds.join(', ')}`, 400);
      }
    }

    const project = new Project({
      ...body,
      members: members.map((id) => new Types.ObjectId(id)),
    });

    const saved = await project.save();

    return {
      ...saved.toJSON(),
      taskCounts: { TODO: 0, IN_PROGRESS: 0, DONE: 0 },
    };
  },

  update: async (
    id: string,
    body: UpdateProjectBody,
  ): Promise<IProjectWithStats> => {
    await projectService.getById(id);

    const members =
      body.members?.filter((id) => Types.ObjectId.isValid(id)) || [];

    if (members.length > 0) {
      const existingUsers = await User.find({
        _id: { $in: members },
      }).select('_id');

      const existingIds = existingUsers.map((u) => u._id.toString());

      const invalidIds = members.filter(
        (id) => !existingIds.includes(id.toString()),
      );
      if (invalidIds.length > 0) {
        throw new AppError(`Members not found: ${invalidIds.join(', ')}`, 400);
      }
    }

    const updated = await Project.findByIdAndUpdate(id, body, {
      new: true,
    }).exec();

    if (!updated) throw new AppError(ErrorMessages.UPDATE_ERROR, 400);

    return {
      ...updated.toJSON(),
      taskCounts: await taskService.countByProject(id),
    };
  },

  delete: async (id: string) => {
    await projectService.getById(id);

    const deleted = await Project.findByIdAndDelete(id).exec();

    if (!deleted) throw new AppError(ErrorMessages.DELETE_ERROR);

    return;
  },
};
