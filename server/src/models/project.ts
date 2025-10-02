import mongoose, { Schema } from 'mongoose';
import { toJSONOptions } from '../utils/common';

export interface IProject {
  id: string;
  title: string;
  description: string;
  members: string[];
  createdAt: string;
}

const ProjectSchema: Schema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [50, 'Title cannot exceed 50 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

ProjectSchema.set('toJSON', toJSONOptions);

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
