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
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Task description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: Object.values(TaskStatusEnum),
      default: TaskStatusEnum.TODO,
    },
    assignee: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task assignee is required'],
    },
    dueDate: {
      type: Date,
      validate: {
        validator: (v: Date) => v > new Date(),
        message: 'Due date must be in the future',
      },
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project ID is required'],
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

TaskSchema.set('toJSON', toJSONOptions);

export const Task = mongoose.model<ITask>('Task', TaskSchema);
