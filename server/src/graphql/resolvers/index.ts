import { DateTimeResolver } from 'graphql-scalars';
import { GraphQLUpload } from 'graphql-upload';
import { attachmentResolvers } from './attachment.resolvers';
import { authResolvers } from './auth.resolvers';
import { projectResolvers } from './project.resolvers';
import { taskResolvers } from './task.resolvers';
import { userResolvers } from './user.resolvers';

export const resolvers = {
  DateTime: DateTimeResolver,
  Upload: GraphQLUpload,

  Query: {
    ...userResolvers.Query,
    ...projectResolvers.Query,
    ...taskResolvers.Query,
    ...attachmentResolvers.Query,
  },

  Mutation: {
    ...authResolvers.Mutation,
    ...projectResolvers.Mutation,
    ...taskResolvers.Mutation,
    ...attachmentResolvers.Mutation,
  },

  Project: projectResolvers.Project,
  Task: taskResolvers.Task,
};
