import { NextFunction, Response } from 'express';
import fs from 'fs';
import { ErrorMessages } from '../constants/errors';
import { IAttachment } from '../models/attachment';
import { attachmentService } from '../services/attachment.service';
import { PublicAttachment } from '../types/attachment/public-attachment';
import { AppError } from '../types/http/error/app-error';
import { AttachmentParams } from '../types/http/request/attachment.request';
import { IAuthRequest } from '../types/http/request/auth.request';
import { ApiResponse } from '../types/http/response/api.response';
import { toPublicAttachment } from '../utils/common';

export const attachmentController = {
  listByTask: async (
    req: IAuthRequest<Pick<AttachmentParams, 'taskId'>>,
    res: Response<ApiResponse<IAttachment[]>>,
    next: NextFunction,
  ) => {
    try {
      const attachments = await attachmentService.getByTaskId(
        req.params.taskId,
        req.user,
      );
      res.json({ data: attachments });
    } catch (err) {
      next(err);
    }
  },

  uploadToTask: async (
    req: IAuthRequest<Pick<AttachmentParams, 'taskId'>>,
    res: Response<ApiResponse<PublicAttachment[]>>,
    next: NextFunction,
  ) => {
    try {
      const files = (req.files as Express.Multer.File[]) || [];
      if (!files.length) {
        throw new AppError(ErrorMessages.NO_FILES_UPLOADED, 400);
      }

      if (!req.user) {
        throw new AppError(ErrorMessages.UNAUTHORIZED, 401);
      }

      const created = await attachmentService.create(
        req.params.taskId,
        files,
        req.user,
      );

      res.status(201).json({ data: created.map((c) => toPublicAttachment(c)) });
    } catch (err) {
      const files = (req.files as Express.Multer.File[]) || [];
      for (const f of files) {
        try {
          await fs.promises.unlink(f.path);
        } catch {}
      }
      next(err);
    }
  },

  downloadById: async (
    req: IAuthRequest<Pick<AttachmentParams, 'id'>>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const att = await attachmentService.getById(req.params.id, req.user);

      const filename = att.originalName;
      const filePath = att.storagePath;

      if (!fs.existsSync(filePath)) {
        throw new AppError(ErrorMessages.MISSING_FILE, 404);
      }

      res.setHeader('Content-Type', att.mimeType);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${encodeURIComponent(filename)}"`,
      );

      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
      stream.on('error', next);
    } catch (err) {
      next(err);
    }
  },

  deleteById: async (
    req: IAuthRequest<Pick<AttachmentParams, 'id'>>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await attachmentService.deleteById(req.params.id, req.user);

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
