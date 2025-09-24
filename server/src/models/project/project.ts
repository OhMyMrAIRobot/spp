import mongoose, { Schema, Types } from 'mongoose';
import { toJSONOptions } from '../../utils/common';

export interface IProject {
  _id?: string;
  title: string;
  description: string;
  members: string[] | Types.ObjectId[];
  createdAt: string;
}

const ProjectSchema: Schema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    description: { type: String },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

ProjectSchema.set('toJSON', toJSONOptions);

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
