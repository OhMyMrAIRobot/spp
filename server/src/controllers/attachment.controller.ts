import { NextFunction, Response } from 'express';
import fs from 'fs';
import { ErrorMessages } from '../constants/error-messages';
import { attachmentService } from '../services/attachment.service';
import { AppError } from '../types/http/error/app-error';
import { AttachmentParams } from '../types/http/request/attachment.request';
import { IAuthRequest } from '../types/http/request/auth.request';

export const attachmentController = {
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
};
