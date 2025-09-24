import { mockTasks } from '../data';
import { ITask } from '../models/task/task';
import {
  CreateTaskBody,
  UpdateTaskBody,
} from '../types/http/request/task.request';
import { generateId } from '../utils/generate-id';

let tasks: ITask[] = [...mockTasks];

export const taskService = {
  getAll: (): ITask[] => tasks,

  getById: (id: string): ITask | undefined => tasks.find((t) => t.id === id),

  getByProjectId: (projectId: string): ITask[] =>
    tasks.filter((t) => t.projectId === projectId),

  create: (data: CreateTaskBody): ITask => {
    const newTask: ITask = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    tasks.push(newTask);

    return newTask;
  },

  update: (id: string, changes: UpdateTaskBody): ITask | null => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return null;
    Object.assign(task, changes);

    return task;
  },

  delete: (id: string): boolean => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return false;

    tasks = tasks.filter((t) => t.id !== id);

    return true;
  },

  countByProject: (projectId: string) => {
    const tasksForProject = tasks.filter((t) => t.projectId === projectId);

    return {
      TODO: tasksForProject.filter((t) => t.status === 'TODO').length,
      IN_PROGRESS: tasksForProject.filter((t) => t.status === 'IN_PROGRESS')
        .length,
      DONE: tasksForProject.filter((t) => t.status === 'DONE').length,
    };
  },
};
