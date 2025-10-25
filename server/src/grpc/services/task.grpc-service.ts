import { taskService } from '../../services/task.serivice';
import { CreateTaskData } from '../../types/task/create-task-data';
import { TaskStatusEnum } from '../../types/task/task-status';
import { UpdateTaskData } from '../../types/task/update-task-data';
import { AuthenticatedCall } from '../interceptoprs/auth.interceptor';
import { fromGrpcTaskStatus, toGrpcTask } from '../mappers/task.mapper';
import {
  CreateTaskRequest,
  DeleteTaskRequest,
  GetAllTasksRequest,
  GetTaskByIdRequest,
  GetTasksByProjectRequest,
  UpdateTaskRequest,
} from '../types/request/task.request';
import {
  CreateTaskResponse,
  DeleteTaskResponse,
  GetAllTasksResponse,
  GetTaskByIdResponse,
  GetTasksByProjectResponse,
  UpdateTaskResponse,
} from '../types/response/task.response';
import { wrapUnaryCall } from '../utils/call-wrapper';

export const taskGrpcService = {
  getAll: wrapUnaryCall<GetAllTasksRequest, GetAllTasksResponse>(
    async (
      call: AuthenticatedCall,
      request: GetAllTasksRequest,
    ): Promise<GetAllTasksResponse> => {
      const tasks = await taskService.getAll();

      return {
        tasks: tasks.map(toGrpcTask),
      };
    },
  ),

  getById: wrapUnaryCall<GetTaskByIdRequest, GetTaskByIdResponse>(
    async (call: AuthenticatedCall, request: GetTaskByIdRequest) => {
      const { id } = request;

      const task = await taskService.getById(id, call.user);

      return {
        task: toGrpcTask(task),
      };
    },
  ),

  getByProject: wrapUnaryCall<
    GetTasksByProjectRequest,
    GetTasksByProjectResponse
  >(async (call: AuthenticatedCall, request: GetTasksByProjectRequest) => {
    const { projectId } = request;

    const tasks = await taskService.getByProjectId(projectId, call.user);

    return {
      tasks: tasks.map(toGrpcTask),
    };
  }),

  create: wrapUnaryCall<CreateTaskRequest, CreateTaskResponse>(
    async (call: AuthenticatedCall, request: CreateTaskRequest) => {
      const { title, description, projectId, dueDate, status } = request;

      const taskData: CreateTaskData = {
        title,
        description,
        projectId: projectId,
        status: TaskStatusEnum.TODO,
      };

      if (dueDate) taskData.dueDate = dueDate;
      if (status !== undefined) taskData.status = fromGrpcTaskStatus(status);

      const task = await taskService.create(taskData, call.user);

      return {
        task: toGrpcTask(task),
      };
    },
  ),

  update: wrapUnaryCall<UpdateTaskRequest, UpdateTaskResponse>(
    async (call: AuthenticatedCall, request: UpdateTaskRequest) => {
      const { id, title, description, dueDate, status } = request;

      const updateData: UpdateTaskData = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (dueDate !== undefined) updateData.dueDate = dueDate;
      if (status !== undefined) updateData.status = fromGrpcTaskStatus(status);

      const task = await taskService.update(id, updateData, call.user);

      return {
        task: toGrpcTask(task),
      };
    },
  ),

  delete: wrapUnaryCall<DeleteTaskRequest, DeleteTaskResponse>(
    async (call: AuthenticatedCall, request: DeleteTaskRequest) => {
      const { id } = request;

      await taskService.delete(id, call.user);

      return {};
    },
  ),
};
