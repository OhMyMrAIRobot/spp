import { GraphQLError } from 'graphql';
import { ZodError } from 'zod';
import { ErrorCodes } from '../../constants/error-codes';
import { ErrorMessages } from '../../constants/error-messages';
import { IProject } from '../../models/project';
import { projectService } from '../../services/project.service';
import { taskService } from '../../services/task.serivice';
import { createValidationError } from '../../utils/zod-errors';
import {
  createProjectSchema,
  updateProjectSchema,
} from '../../validations/project.validation';
import { GraphQLContext } from '../context';
import {
  CreateProjectInput,
  UpdateProjectInput,
} from '../inputs/project.inputs';
import { requireAdmin, requireAuth } from '../utils/auth-guards';

export const projectResolvers = {
  Query: {
    projects: async (_: unknown, __: unknown, context: GraphQLContext) => {
      const user = requireAuth(context);
      return projectService.getAllRaw(user);
    },

    project: async (
      _: unknown,
      { id }: { id: string },
      context: GraphQLContext,
    ) => {
      const user = requireAuth(context);

      try {
        const project = await projectService.getByIdRaw(id, user);
        return project;
      } catch (err: any) {
        throw new GraphQLError(err.message || ErrorMessages.PROJECT_NOT_FOUND, {
          extensions: {
            code:
              err.message === ErrorMessages.FORBIDDEN
                ? ErrorCodes.FORBIDDEN
                : ErrorCodes.BAD_USER_INPUT,
          },
        });
      }
    },
  },

  Mutation: {
    createProject: async (
      _: unknown,
      { input }: CreateProjectInput,
      context: GraphQLContext,
    ) => {
      requireAdmin(context);

      try {
        createProjectSchema.parse(input);

        const project = await projectService.create(input);
        return project;
      } catch (err: any) {
        if (err instanceof ZodError) {
          throw createValidationError(err);
        }

        throw new GraphQLError(
          err.message || ErrorMessages.FAILED_CREATE_PROJECT,
          {
            extensions: { code: ErrorCodes.BAD_USER_INPUT },
          },
        );
      }
    },

    updateProject: async (
      _: unknown,
      { id, input }: UpdateProjectInput,
      context: GraphQLContext,
    ) => {
      requireAdmin(context);

      try {
        updateProjectSchema.parse(input);

        const project = await projectService.update(id, input);
        return project;
      } catch (err: any) {
        if (err instanceof ZodError) {
          throw createValidationError(err);
        }

        throw new GraphQLError(
          err.message || ErrorMessages.FAILED_UPDATE_PROJECT,
          {
            extensions: { code: ErrorCodes.BAD_USER_INPUT },
          },
        );
      }
    },

    deleteProject: async (
      _: unknown,
      { id }: { id: string },
      context: GraphQLContext,
    ) => {
      requireAdmin(context);

      try {
        await projectService.delete(id);
        return true;
      } catch (err: any) {
        console.log(err);
        throw new GraphQLError(
          err.message || ErrorMessages.FAILED_DELETE_PROJECT,
          {
            extensions: { code: ErrorCodes.BAD_USER_INPUT },
          },
        );
      }
    },
  },

  Project: {
    members: async (parent: IProject, _: unknown, context: GraphQLContext) => {
      return context.loaders.membersByProjectLoader.load(parent.id);
    },

    taskCounts: async (parent: IProject) => {
      return taskService.countByProject(parent.id);
    },
  },
};
