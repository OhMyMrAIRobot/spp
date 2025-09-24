import { mockProjects } from '../data';
import { IProject } from '../models/project/project';
import { IProjectWithStats } from '../models/project/project-with-stats';
import {
  CreateProjectBody,
  UpdateProjectBody,
} from '../types/http/request/project.request';
import { generateId } from '../utils/generate-id';
import { taskService } from './task.serivice';

let projects: IProject[] = [...mockProjects];

export const projectService = {
  getAll: (): IProjectWithStats[] =>
    projects.map((p) => ({
      ...p,
      taskCounts: taskService.countByProject(p.id),
    })),

  getById: (id: string): IProjectWithStats | undefined => {
    const project = projects.find((p) => p.id === id);
    if (!project) return undefined;
    return { ...project, taskCounts: taskService.countByProject(id) };
  },

  create: (body: CreateProjectBody): IProjectWithStats => {
    const newProject: IProject = {
      id: generateId(),
      title: body.title,
      createdAt: new Date().toISOString(),
    };

    projects.push(newProject);

    return {
      ...newProject,
      taskCounts: taskService.countByProject(newProject.id),
    };
  },

  update: (
    id: string,
    body: UpdateProjectBody,
  ): IProjectWithStats | undefined => {
    const project = projects.find((p) => p.id === id);

    if (!project) return undefined;
    if (body.title !== undefined) project.title = body.title;

    return { ...project, taskCounts: taskService.countByProject(id) };
  },

  delete: (id: string): boolean => {
    const before = projects.length;
    projects = projects.filter((p) => p.id !== id);
    return projects.length < before;
  },
};
