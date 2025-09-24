import mongoose, { Schema, Types } from 'mongoose';
import { toJSONOptions } from '../../utils/common';
import { TaskStatusEnum } from './task-status';

export interface ITask {
  _id?: string;
  title: string;
  description: string;
  status: TaskStatusEnum;
  assignee: string | Types.ObjectId;
  createdAt: string;
  dueDate?: string;
  projectId: string | Types.ObjectId;
}

const TaskSchema: Schema = new Schema<ITask>(
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
