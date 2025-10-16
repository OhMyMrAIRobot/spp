import fs from 'fs/promises';
import { Types } from 'mongoose';
import { ErrorMessages } from '../constants/error-messages';
import { Attachment, type IAttachment } from '../models/attachment';
import { JwtPayload } from '../types/jwt-payload';
import { UploadedFile } from '../types/uploaded-file';
import { ensureProjectMembership } from '../utils/common';
import { projectService } from './project.service';
import { taskService } from './task.serivice';

export const attachmentService = {
  async getByTaskId(taskId: string, user?: JwtPayload): Promise<IAttachment[]> {
    const task = await taskService.getByIdRaw(taskId);
    const project = await projectService.getByIdRaw(task.projectId);

    if (user) {
      ensureProjectMembership(project, user);
    }

    const attachments = await Attachment.find({ taskId }).exec();

    return attachments.map((a) => a.toJSON() as IAttachment);
  },

  async create(
    taskId: string,
    files: UploadedFile[],
    user: JwtPayload,
  ): Promise<IAttachment[]> {
    const task = await taskService.getByIdRaw(taskId);
    const project = await projectService.getByIdRaw(task.projectId);

    ensureProjectMembership(project, user);
    taskService.ensureAccess(task, user);

    const docs: Partial<IAttachment>[] = files.map((f) => ({
      taskId: task.id,
      projectId: task.projectId,
      originalName: f.originalname,
      mimeType: f.mimetype,
      size: f.size,
      storagePath: f.path,
      uploadedBy: user.id,
    }));

    const created = await Attachment.insertMany(docs);

    return created.map((c) => c.toJSON() as IAttachment);
  },

  async getById(id: string, user?: JwtPayload) {
    if (!Types.ObjectId.isValid(id))
      throw new Error(ErrorMessages.INVALID_IDENTIFIER);

    const att = await Attachment.findById(id).exec();

    if (!att) {
      throw new Error(ErrorMessages.ATTACHMENT_NOT_FOUND);
    }

    if (user) {
      const project = await projectService.getByIdRaw(att.projectId.toString());
      ensureProjectMembership(project, user);
    }

    return att.toJSON() as IAttachment;
  },

  async deleteById(id: string, user?: JwtPayload) {
    const att = await attachmentService.getById(id, user);

    if (user) {
      const task = await taskService.getByIdRaw(att.taskId);
      taskService.ensureAccess(task, user);
    }

    try {
      await fs.unlink(att.storagePath);
    } catch (e: any) {
      if (e?.code !== 'ENOENT')
        throw new Error(ErrorMessages.FAILED_DELETE_ATTACHMENT);
    }

    await Attachment.deleteOne({ _id: id }).exec();

    return;
  },

  deleteAllByTaskId: async (taskId: string): Promise<void> => {
    if (!Types.ObjectId.isValid(taskId)) {
      throw new Error(ErrorMessages.INVALID_IDENTIFIER);
    }

    const attachments = await attachmentService.getByTaskId(taskId);

    if (attachments.length === 0) return;

    const deletePromises = attachments.map(async (attachment) => {
      try {
        await fs.access(attachment.storagePath);
        await fs.unlink(attachment.storagePath);
      } catch (e: any) {
        if (e?.code !== 'ENOENT')
          throw new Error(ErrorMessages.FAILED_DELETE_ATTACHMENT);
      }

      try {
        await Attachment.findByIdAndDelete(attachment.id).exec();
      } catch (error) {
        throw new Error(ErrorMessages.FAILED_DELETE_ATTACHMENT);
      }
    });

    await Promise.all(deletePromises);
  },
};
