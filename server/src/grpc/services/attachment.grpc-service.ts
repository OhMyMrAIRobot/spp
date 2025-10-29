import * as grpc from '@grpc/grpc-js';
import fs from 'fs/promises';
import path from 'path';
import { attachmentService } from '../../services/attachment.service';
import { AppError } from '../../types/http/error/app-error';
import { AuthenticatedCall } from '../interceptoprs/auth.interceptor';
import {
  toGrpcAttachment,
  toGrpcAttachmentFull,
} from '../mappers/attachment.mapper';
import {
  DeleteByIdRequest,
  DownloadByIdRequest,
  ListByTaskRequest,
} from '../types/request/attachment.request';
import {
  DeleteByIdResponse,
  DownloadFileResponse,
  ListByTaskResponse,
  UploadFileResponse,
} from '../types/response/attachment.response';
import { wrapUnaryCall } from '../utils/call-wrapper';
import { handleGrpcError } from '../utils/grpc-error';

const CHUNK_SIZE = 64 * 1024;

interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
}

export const attachmentGrpcService = {
  listByTask: wrapUnaryCall<ListByTaskRequest, ListByTaskResponse>(
    async (call: AuthenticatedCall, request: ListByTaskRequest) => {
      const { taskId } = request;

      const attachments = await attachmentService.getByTaskId(
        taskId,
        call.user,
      );

      return {
        attachments: attachments.map(toGrpcAttachmentFull),
      };
    },
  ),

  uploadToTask: (
    call: AuthenticatedCall,
    callback: grpc.sendUnaryData<UploadFileResponse>,
  ) => {
    (async () => {
      try {
        if (!call.user) throw new AppError('UNAUTHORIZED', 401);

        const { taskId, originalName, mimeType, data } = call.request;
        const dir = path.join(process.cwd(), 'uploads', 'tasks', taskId);
        await fs.mkdir(dir, { recursive: true });

        const ext = path.extname(originalName);
        const filename = `${Date.now()}-${Math.random().toString(16).slice(2)}${ext}`;
        const filePath = path.join(dir, filename);
        await fs.writeFile(filePath, data);

        const created = await attachmentService.create(
          taskId,
          [
            {
              originalname: originalName,
              mimetype: mimeType,
              size: data.length,
              path: filePath,
            },
          ],
          call.user,
        );

        callback(null, {
          attachments: created.map((att) => toGrpcAttachment(att)),
        });
      } catch (err) {
        callback(err as Error, null);
      }
    })();
  },

  downloadById: async (
    call: grpc.ServerUnaryCall<DownloadByIdRequest, DownloadFileResponse> &
      AuthenticatedCall,
    callback: grpc.sendUnaryData<DownloadFileResponse>,
  ) => {
    try {
      const { id } = call.request;

      const att = await attachmentService.getById(id, call.user);

      await fs.access(att.storagePath);

      const fileBuffer = await fs.readFile(att.storagePath);

      callback(null, {
        metadata: {
          originalName: att.originalName,
          mimeType: att.mimeType,
          size: att.size.toString(),
        },
        data: fileBuffer,
      });
    } catch (error) {
      handleGrpcError(error, (err) => callback(err as grpc.ServiceError, null));
    }
  },

  deleteById: wrapUnaryCall<DeleteByIdRequest, DeleteByIdResponse>(
    async (call: AuthenticatedCall, request: DeleteByIdRequest) => {
      const { id } = request;

      await attachmentService.deleteById(id, call.user);

      return {};
    },
  ),
};
