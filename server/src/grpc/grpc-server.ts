import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import dotenv from 'dotenv';
import path from 'path';
import { UserRoleEnum } from '../types/user/user-role';
import {
  authenticateInterceptor,
  authorizeInterceptor,
} from './interceptoprs/auth.interceptor';
import { validateInterceptor } from './interceptoprs/validation.interceptor';
import { attachmentGrpcService } from './services/attachment.grpc-service';
import { authGrpcService } from './services/auth.grpc-service';
import { projectGrpcService } from './services/project.grpc-service';
import { taskGrpcService } from './services/task.grpc-service';
import { userGrpcService } from './services/user.grpc-service';
import {
  deleteByIdGrpcSchema,
  downloadByIdGrpcSchema,
  listByTaskGrpcSchema,
} from './validations/attachment.grpc-validation';
import {
  loginGrpcSchema,
  registerGrpcSchema,
} from './validations/auth.grpc-validation';
import {
  createProjectGrpcSchema,
  deleteProjectGrpcSchema,
  getProjectByIdGrpcSchema,
  updateProjectGrpcSchema,
} from './validations/project.grpc-validation';
import {
  createTaskGrpcSchema,
  deleteTaskGrpcSchema,
  getTaskByIdGrpcSchema,
  getTasksByProjectGrpcSchema,
  updateTaskGrpcSchema,
} from './validations/task.grpc-validation';
import { getUserByIdGrpcSchema } from './validations/user.grpc-validation';

dotenv.config();

const PROTO_PATH_AUTH = path.join(__dirname, '../proto/auth.proto');
const PROTO_PATH_USER = path.join(__dirname, '../proto/user.proto');
const PROTO_PATH_PROJECT = path.join(__dirname, '../proto/project.proto');
const PROTO_PATH_TASK = path.join(__dirname, '../proto/task.proto');
const PROTO_PATH_ATTACHMENT = path.join(__dirname, '../proto/attachment.proto');

const packageDefinition = protoLoader.loadSync(
  [
    PROTO_PATH_AUTH,
    PROTO_PATH_USER,
    PROTO_PATH_PROJECT,
    PROTO_PATH_TASK,
    PROTO_PATH_ATTACHMENT,
  ],
  {
    keepCase: true,
    longs: String,
    enums: Number,
    defaults: true,
    oneofs: true,
  },
);

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as any;

const authProto = protoDescriptor.auth;
const userProto = protoDescriptor.user;
const projectProto = protoDescriptor.project;
const taskProto = protoDescriptor.task;
const attachmentProto = protoDescriptor.attachment;

function withMiddleware(handler: any, middlewares: any[] = []) {
  return (call: any, callback: any) => {
    let index = 0;

    const next = () => {
      if (index < middlewares.length) {
        const middleware = middlewares[index++];
        middleware(call, callback, next);
      } else {
        handler(call, callback);
      }
    };

    next();
  };
}

const server = new grpc.Server();

server.addService(authProto.AuthService.service, {
  register: withMiddleware(authGrpcService.register, [
    validateInterceptor(registerGrpcSchema),
  ]),
  login: withMiddleware(authGrpcService.login, [
    validateInterceptor(loginGrpcSchema),
  ]),
  refresh: withMiddleware(authGrpcService.refresh),
  logout: withMiddleware(authGrpcService.logout, [authenticateInterceptor]),
});

server.addService(userProto.UserService.service, {
  getAll: withMiddleware(userGrpcService.getAll, [
    authenticateInterceptor,
    authorizeInterceptor([UserRoleEnum.ADMIN]),
  ]),
  getById: withMiddleware(userGrpcService.getById, [
    authenticateInterceptor,
    authorizeInterceptor([UserRoleEnum.ADMIN]),
    validateInterceptor(getUserByIdGrpcSchema),
  ]),
});

server.addService(projectProto.ProjectService.service, {
  getAll: withMiddleware(projectGrpcService.getAll, [authenticateInterceptor]),
  getById: withMiddleware(projectGrpcService.getById, [
    authenticateInterceptor,
    validateInterceptor(getProjectByIdGrpcSchema),
  ]),
  create: withMiddleware(projectGrpcService.create, [
    authenticateInterceptor,
    authorizeInterceptor([UserRoleEnum.ADMIN]),
    validateInterceptor(createProjectGrpcSchema),
  ]),
  update: withMiddleware(projectGrpcService.update, [
    authenticateInterceptor,
    authorizeInterceptor([UserRoleEnum.ADMIN]),
    validateInterceptor(updateProjectGrpcSchema),
  ]),
  delete: withMiddleware(projectGrpcService.delete, [
    authenticateInterceptor,
    authorizeInterceptor([UserRoleEnum.ADMIN]),
    validateInterceptor(deleteProjectGrpcSchema),
  ]),
});

server.addService(taskProto.TaskService.service, {
  getAll: withMiddleware(taskGrpcService.getAll, [
    authenticateInterceptor,
    authorizeInterceptor([UserRoleEnum.ADMIN]),
  ]),
  getById: withMiddleware(taskGrpcService.getById, [
    authenticateInterceptor,
    validateInterceptor(getTaskByIdGrpcSchema),
  ]),
  getByProject: withMiddleware(taskGrpcService.getByProject, [
    authenticateInterceptor,
    validateInterceptor(getTasksByProjectGrpcSchema),
  ]),
  create: withMiddleware(taskGrpcService.create, [
    authenticateInterceptor,
    validateInterceptor(createTaskGrpcSchema),
  ]),
  update: withMiddleware(taskGrpcService.update, [
    authenticateInterceptor,
    validateInterceptor(updateTaskGrpcSchema),
  ]),
  delete: withMiddleware(taskGrpcService.delete, [
    authenticateInterceptor,
    validateInterceptor(deleteTaskGrpcSchema),
  ]),
});

server.addService(attachmentProto.AttachmentService.service, {
  listByTask: withMiddleware(attachmentGrpcService.listByTask, [
    authenticateInterceptor,
    validateInterceptor(listByTaskGrpcSchema),
  ]),
  uploadFileToTask: withMiddleware(attachmentGrpcService.uploadToTask, [
    authenticateInterceptor,
  ]),
  downloadById: withMiddleware(attachmentGrpcService.downloadById, [
    authenticateInterceptor,
    validateInterceptor(downloadByIdGrpcSchema),
  ]),
  deleteById: withMiddleware(attachmentGrpcService.deleteById, [
    authenticateInterceptor,
    validateInterceptor(deleteByIdGrpcSchema),
  ]),
});

const PORT = process.env.PORT || '50051';
const HOST = process.env.HOST || '0.0.0.0';

export async function startRPCServer() {
  try {
    server.bindAsync(
      `${HOST}:${PORT}`,
      grpc.ServerCredentials.createInsecure(),
      (err, port) => {
        if (err) {
          console.error('Failed to start gRPC server:', err);
          process.exit(1);
        }
        console.log(`gRPC server running on ${HOST}:${port}`);
      },
    );
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}
