import { Types } from 'mongoose';
import { ErrorMessages } from '../constants/error-messages';
import { ProjectInput } from '../graphql/inputs/project.inputs';
import { IProject, Project } from '../models/project';
import { Task } from '../models/task';
import { User } from '../models/user';
import { JwtPayload } from '../types/jwt-payload';
import { UserRoleEnum } from '../types/user/user-role';
import { ensureProjectMembership } from '../utils/common';

export const projectService = {
  getAllRaw: async (user?: JwtPayload): Promise<IProject[]> => {
    let projects = [];

    if (user && user.role === UserRoleEnum.MEMBER) {
      projects = await Project.find({ members: user.id }).exec();
    } else {
      projects = await Project.find().exec();
    }

    return projects.map((p) => p.toJSON());
  },

  getByIdRaw: async (id: string, user?: JwtPayload): Promise<IProject> => {
    if (!Types.ObjectId.isValid(id))
      throw new Error(ErrorMessages.INVALID_IDENTIFIER);

    const project = await Project.findById(id).exec();

    if (!project) throw new Error(ErrorMessages.PROJECT_NOT_FOUND);

    if (user) {
      ensureProjectMembership(project.toJSON(), user);
    }

    return project.toJSON();
  },

  create: async (body: ProjectInput): Promise<IProject> => {
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
        throw new Error(`Members not found: ${invalidIds.join(', ')}`);
      }
    }

    const project = new Project({
      ...body,
      members: members.map((id) => new Types.ObjectId(id)),
    });

    const saved = await project.save();
    return saved.toJSON();
  },

  update: async (
    id: string,
    body: Partial<ProjectInput>,
  ): Promise<IProject> => {
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
        throw new Error(`Members not found: ${invalidIds.join(', ')}`);
      }
    }

    const updated = await Project.findByIdAndUpdate(id, body, {
      new: true,
    }).exec();

    if (!updated) throw new Error(ErrorMessages.FAILED_UPDATE_PROJECT);

    return updated.toJSON();
  },

  delete: async (id: string) => {
    await projectService.getByIdRaw(id);

    const deletedProject = await Project.findByIdAndDelete(id).exec();
    if (!deletedProject) {
      throw new Error(ErrorMessages.FAILED_DELETE_PROJECT);
    }

    await Task.deleteMany({ projectId: id }).exec();

    return;
  },
};
