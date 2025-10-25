import { projectService } from '../../services/project.service';
import { AuthenticatedCall } from '../interceptoprs/auth.interceptor';
import { toGrpcProject } from '../mappers/project.mapper';
import {
  CreateProjectRequest,
  DeleteProjectRequest,
  GetAllProjectsRequest,
  GetProjectByIdRequest,
  UpdateProjectRequest,
} from '../types/request/project.request';
import {
  CreateProjectResponse,
  DeleteProjectResponse,
  GetAllProjectsResponse,
  GetProjectByIdResponse,
  UpdateProjectResponse,
} from '../types/response/project.response';
import { wrapUnaryCall } from '../utils/call-wrapper';

export const projectGrpcService = {
  getAll: wrapUnaryCall<GetAllProjectsRequest, GetAllProjectsResponse>(
    async (call: AuthenticatedCall, request: GetAllProjectsRequest) => {
      const projects = await projectService.getAll(call.user);

      return {
        projects: projects.map(toGrpcProject),
      };
    },
  ),

  getById: wrapUnaryCall<GetProjectByIdRequest, GetProjectByIdResponse>(
    async (call: AuthenticatedCall, request: GetProjectByIdRequest) => {
      const { id } = request;

      const project = await projectService.getById(id, call.user);

      return {
        project: toGrpcProject(project),
      };
    },
  ),

  create: wrapUnaryCall<CreateProjectRequest, CreateProjectResponse>(
    async (call: AuthenticatedCall, request: CreateProjectRequest) => {
      const { title, description, members } = request;

      const project = await projectService.create({
        title,
        description,
        members: members || [],
      });

      return {
        project: toGrpcProject(project),
      };
    },
  ),

  update: wrapUnaryCall<UpdateProjectRequest, UpdateProjectResponse>(
    async (call: AuthenticatedCall, request: UpdateProjectRequest) => {
      const { id } = request;

      const project = await projectService.update(id, request);

      return {
        project: toGrpcProject(project),
      };
    },
  ),

  delete: wrapUnaryCall<DeleteProjectRequest, DeleteProjectResponse>(
    async (call: AuthenticatedCall, request: DeleteProjectRequest) => {
      const { id } = request;

      await projectService.delete(id);

      return {};
    },
  ),
};
