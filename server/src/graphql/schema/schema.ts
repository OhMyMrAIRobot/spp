import { makeExecutableSchema } from '@graphql-tools/schema';
import { resolvers } from '../resolvers/index';
import { attachmentTypeDefs } from './attachment.schema';
import { authTypeDefs } from './auth.schema';
import { baseTypeDefs } from './base.schema';
import { projectTypeDefs } from './project.schema';
import { scalarsTypeDefs } from './scalars.schema';
import { taskTypeDefs } from './task.schema';
import { userTypeDefs } from './user.schema';

export const schema = makeExecutableSchema({
  typeDefs: [
    baseTypeDefs,
    scalarsTypeDefs,
    userTypeDefs,
    authTypeDefs,
    projectTypeDefs,
    taskTypeDefs,
    attachmentTypeDefs,
  ],
  resolvers,
});
