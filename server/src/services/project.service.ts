import { Types } from 'mongoose';
import { ErrorMessages } from '../constants/error-messages';
import { IProject, Project } from '../models/project';
import { Task } from '../models/task';
import { User } from '../models/user';
import { AppError } from '../types/http/error/app-error';
import { JwtPayload } from '../types/jwt-payload';
import { CreateProjectData } from '../types/project/create-project-data';
import { IProjectWithTaskCounts } from '../types/project/project-with-task-counts';
import { UpdateProjectData } from '../types/project/update-project-data';
import { UserRoleEnum } from '../types/user/user-role';
import { ensureProjectMembership } from '../utils/common';
import { taskService } from './task.serivice';

export const projectService = {
  getAll: async (user?: JwtPayload): Promise<IProjectWithTaskCounts[]> => {
    let projects = [];

    if (user && user.role === UserRoleEnum.MEMBER) {
      projects = await Project.find({ members: user.id }).exec();
    } else {
      projects = await Project.find().exec();
    }

    const projectsWithStats: IProjectWithTaskCounts[] = [];

    for (const p of projects) {
      projectsWithStats.push({
        ...p.toJSON(),
        taskCounts: await taskService.countByProject(p._id.toString()),
      });
    }

    return projectsWithStats;
  },

  getById: async (
    id: string,
    user?: JwtPayload,
  ): Promise<IProjectWithTaskCounts> => {
    if (!Types.ObjectId.isValid(id))
      throw new AppError(ErrorMessages.INVALID_IDENTIFIER, 400);

    const project = await Project.findById(id).exec();

    if (!project) throw new AppError(ErrorMessages.PROJECT_NOT_FOUND, 404);

    if (user) {
      ensureProjectMembership(project.toJSON(), user);
    }

    return {
      ...project.toJSON(),
      taskCounts: await taskService.countByProject(id),
    };
  },

  getByIdRaw: async (id: string, user?: JwtPayload): Promise<IProject> => {
    if (!Types.ObjectId.isValid(id))
      throw new AppError(ErrorMessages.INVALID_IDENTIFIER, 400);

    const project = await Project.findById(id).exec();

    if (!project) throw new AppError(ErrorMessages.PROJECT_NOT_FOUND, 404);

    if (user) {
      ensureProjectMembership(project.toJSON(), user);
    }

    return project.toJSON();
  },

  create: async (body: CreateProjectData): Promise<IProjectWithTaskCounts> => {
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
    body: UpdateProjectData,
  ): Promise<IProjectWithTaskCounts> => {
    await projectService.getByIdRaw(id);

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

    if (!updated) throw new AppError(ErrorMessages.FAILED_UPDATE_PROJECT, 400);

    return {
      ...updated.toJSON(),
      taskCounts: await taskService.countByProject(id),
    };
  },

  delete: async (id: string) => {
    await projectService.getByIdRaw(id);

    try {
      const deletedProject = await Project.findByIdAndDelete(id).exec();
      if (!deletedProject) {
        throw new AppError(ErrorMessages.FAILED_DELETE_PROJECT);
      }

      await Task.deleteMany({ projectId: id }).exec();

      return;
    } catch (error) {
      throw new AppError(ErrorMessages.FAILED_DELETE_PROJECT);
    }
  },
};
