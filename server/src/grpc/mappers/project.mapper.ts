import { IProjectWithTaskCounts } from '../../types/project/project-with-task-counts';

export function toGrpcProject(project: IProjectWithTaskCounts) {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    members: project.members,
    created_at: project.createdAt,
    task_counts: {
      todo: project.taskCounts.TODO,
      in_progress: project.taskCounts.IN_PROGRESS,
      done: project.taskCounts.DONE,
    },
  };
}
