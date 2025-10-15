import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { graphqlUploadExpress } from 'graphql-upload';
import http from 'http';
import { MAX_FILE_SIZE, MAX_FILES_COUNT } from './constants/constants';
import { attachmentController } from './controllers/attachment.controller';
import { createContext, GraphQLContext } from './graphql/context';
import { schema } from './graphql/schema/schema';
import { authenticate } from './middlewares/auth.middleware';
import { errorHandler } from './middlewares/error-handler';
import { formatError } from './utils/format-error';

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer<GraphQLContext>({
  schema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  formatError,
  introspection: false,
  includeStacktraceInErrorResponses: false,
});

export const startServer = async () => {
  await server.start();

  app.use(
    cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
    }),
  );

  app.use(express.json());
  app.use(cookieParser());

  app.use(
    '/graphql',
    graphqlUploadExpress({
      maxFileSize: MAX_FILE_SIZE,
      maxFiles: MAX_FILES_COUNT,
    }),
    expressMiddleware(server, {
      context: async ({ req, res }) => createContext({ req, res }),
    }),
  );

  app.get('/', (_req, res) => {
    res.redirect('/graphql');
  });

  app.get(
    '/attachments/:id/download',
    authenticate,
    attachmentController.downloadById,
    errorHandler,
  );

  return httpServer;
};

export { httpServer };
