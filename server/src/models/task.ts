import mongoose, { Schema } from 'mongoose';
import { TaskStatusEnum } from '../types/task/task-status';
import { toJSONOptions } from '../utils/common';

export interface ITask {
  id: string;
  title: string;
  description: string;
  status: TaskStatusEnum;
  assignee: string;
  createdAt: string;
  dueDate?: string;
  projectId: string;
}

const TaskSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(TaskStatusEnum),
      default: TaskStatusEnum.TODO,
    },
    assignee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    dueDate: { type: Date },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

TaskSchema.set('toJSON', toJSONOptions);

export const Task = mongoose.model<ITask>('Task', TaskSchema);
