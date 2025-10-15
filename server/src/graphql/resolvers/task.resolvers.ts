import { GraphQLError } from 'graphql';
import { ZodError } from 'zod';
import { ErrorCodes } from '../../constants/error-codes';
import { ErrorMessages } from '../../constants/error-messages';
import { ITask } from '../../models/task';
import { projectService } from '../../services/project.service';
import { taskService } from '../../services/task.serivice';
import { ensureProjectMembership } from '../../utils/common';
import { createValidationError } from '../../utils/zod-errors';
import {
  createTaskSchema,
  updateTaskSchema,
} from '../../validations/task.validation';
import { GraphQLContext } from '../context';
import { CreateTaskInput, UpdateTaskInput } from '../inputs/task.inputs';
import { requireAdmin, requireAuth } from '../utils/auth-guards';

export const taskResolvers = {
  Query: {
    tasks: async (_: unknown, __: unknown, context: GraphQLContext) => {
      requireAdmin(context);

      return taskService.getAllRaw();
    },

    task: async (
      _: unknown,
      { id }: { id: string },
      context: GraphQLContext,
    ) => {
      const user = requireAuth(context);
      try {
        const task = await taskService.getByIdRaw(id, user);
        return task;
      } catch (err: any) {
        throw new GraphQLError(err.message || ErrorMessages.TASK_NOT_FOUND, {
          extensions: {
            code:
              err.message === ErrorMessages.FORBIDDEN
                ? ErrorCodes.FORBIDDEN
                : ErrorCodes.BAD_USER_INPUT,
          },
        });
      }
    },

    tasksByProject: async (
      _: unknown,
      { projectId }: { projectId: string },
      context: GraphQLContext,
    ) => {
      const user = requireAuth(context);

      try {
        const project = await projectService.getByIdRaw(projectId);
        ensureProjectMembership(project, user);

        const tasks = await taskService.getByProjectIdRaw(projectId);
        return tasks;
      } catch (err: any) {
        throw new GraphQLError(err.message || ErrorMessages.TASK_NOT_FOUND, {
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
    createTask: async (
      _: unknown,
      { input }: CreateTaskInput,
      context: GraphQLContext,
    ) => {
      const user = requireAuth(context);

      try {
        createTaskSchema.parse(input);
        const task = await taskService.create(input, user);
        return task;
      } catch (err: any) {
        if (err instanceof ZodError) {
          throw createValidationError(err);
        }

        throw new GraphQLError(
          err.message || ErrorMessages.FAILED_CREATE_TASK,
          {
            extensions: {
              code:
                err.message === ErrorMessages.FORBIDDEN
                  ? ErrorCodes.FORBIDDEN
                  : ErrorCodes.BAD_USER_INPUT,
            },
          },
        );
      }
    },

    updateTask: async (
      _: unknown,
      { id, input }: UpdateTaskInput,
      context: GraphQLContext,
    ) => {
      const user = requireAuth(context);

      try {
        updateTaskSchema.parse(input);
        const task = await taskService.update(id, input, user);
        return task;
      } catch (err: any) {
        if (err instanceof ZodError) {
          throw createValidationError(err);
        }

        throw new GraphQLError(
          err.message || ErrorMessages.FAILED_UPDATE_TASK,
          {
            extensions: {
              code:
                err.message === ErrorMessages.FORBIDDEN
                  ? ErrorCodes.FORBIDDEN
                  : ErrorCodes.BAD_USER_INPUT,
            },
          },
        );
      }
    },

    deleteTask: async (
      _: unknown,
      { id }: { id: string },
      context: GraphQLContext,
    ) => {
      const user = requireAuth(context);

      try {
        await taskService.delete(id, user);
        return true;
      } catch (err: any) {
        throw new GraphQLError(
          err.message || ErrorMessages.FAILED_UPDATE_TASK,
          {
            extensions: {
              code:
                err.message === ErrorMessages.FORBIDDEN
                  ? ErrorCodes.FORBIDDEN
                  : ErrorCodes.BAD_USER_INPUT,
            },
          },
        );
      }
    },
  },

  Task: {
    user: async (parent: ITask, _: unknown, context: GraphQLContext) => {
      const user = await context.loaders.userLoader.load(parent.assignee);

      if (!user) {
        throw new GraphQLError(ErrorMessages.USER_NOT_FOUND);
      }

      return {
        id: user.id,
        username: user.username,
        role: user.role,
      };
    },

    project: async (parent: ITask, _: unknown, context: GraphQLContext) => {
      const project = await context.loaders.projectLoader.load(
        parent.projectId,
      );

      if (!project) {
        throw new GraphQLError(ErrorMessages.PROJECT_NOT_FOUND);
      }

      return project;
    },

    attachments: async (parent: ITask, _: unknown, context: GraphQLContext) => {
      return context.loaders.attachmentsByTaskLoader.load(parent.id);
    },
  },
};
