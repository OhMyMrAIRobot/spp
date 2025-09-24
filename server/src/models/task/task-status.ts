export const TaskStatusEnum = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
} as const;

export type TaskStatusEnum = keyof typeof TaskStatusEnum;
