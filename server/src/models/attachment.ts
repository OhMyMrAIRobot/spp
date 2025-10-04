import mongoose, { Schema } from 'mongoose';
import { toJSONOptions } from '../utils/common';

export interface IAttachment {
  id: string;
  taskId: string;
  projectId: string;
  originalName: string;
  mimeType: string;
  size: number;
  storagePath: string;
  uploadedBy: string;
  createdAt: string;
}

const AttachmentSchema: Schema = new Schema(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
      index: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    storagePath: { type: String, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

AttachmentSchema.set('toJSON', toJSONOptions);

export const Attachment = mongoose.model<IAttachment>(
  'Attachment',
  AttachmentSchema,
);
