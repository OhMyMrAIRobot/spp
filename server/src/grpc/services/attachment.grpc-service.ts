import * as grpc from '@grpc/grpc-js';
import fs from 'fs';
import path from 'path';
import { ErrorMessages } from '../../constants/error-messages';
import { attachmentService } from '../../services/attachment.service';
import { AppError } from '../../types/http/error/app-error';
import { toPublicAttachment } from '../../utils/common';
import { AuthenticatedCall } from '../interceptoprs/auth.interceptor';
import {
  toGrpcAttachment,
  toGrpcAttachmentFull,
} from '../mappers/attachment.mapper';
import {
  DeleteByIdRequest,
  DownloadByIdRequest,
  ListByTaskRequest,
  UploadChunk,
  UploadMetadata,
} from '../types/request/attachment.request';
import {
  DeleteByIdResponse,
  DownloadChunk,
  ListByTaskResponse,
  UploadResponse,
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

  uploadToTask: async (
    call: grpc.ServerReadableStream<UploadChunk, UploadResponse> &
      AuthenticatedCall,
  ): Promise<UploadResponse | undefined> => {
    try {
      let metadata: UploadMetadata | null = null;
      let fileBuffer = Buffer.alloc(0);

      for await (const chunk of call) {
        if (chunk.metadata) {
          metadata = chunk.metadata;
        } else if (chunk.chunk) {
          fileBuffer = Buffer.concat([fileBuffer, chunk.chunk]);
        }
      }

      if (!metadata) {
        throw new AppError(ErrorMessages.NO_FILES_UPLOADED, 400);
      }

      if (!call.user) {
        throw new AppError(ErrorMessages.UNAUTHORIZED, 401);
      }

      const baseDir =
        process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
      const dir = path.join(baseDir, 'tasks', metadata.taskId);
      fs.mkdirSync(dir, { recursive: true });

      const ext = path.extname(metadata.originalName);
      const filename = `${Date.now()}-${Math.random().toString(16).slice(2)}${ext}`;
      const filePath = path.join(dir, filename);

      await fs.promises.writeFile(filePath, fileBuffer);

      const file: UploadedFile = {
        fieldname: 'files',
        originalname: metadata.originalName,
        encoding: '7bit',
        mimetype: metadata.mimeType,
        size: fileBuffer.length,
        destination: dir,
        filename: filename,
        path: filePath,
      };

      const created = await attachmentService.create(
        metadata.taskId,
        [file as any],
        call.user,
      );

      return {
        attachments: created.map((c) =>
          toGrpcAttachment(toPublicAttachment(c)),
        ),
      };
    } catch (error) {
      handleGrpcError(error, (err) => {
        if (err) {
          call.destroy(err as Error);
        }
      });
      return undefined;
    }
  },

  downloadById: async (
    call: grpc.ServerWritableStream<DownloadByIdRequest, DownloadChunk> &
      AuthenticatedCall,
  ): Promise<void> => {
    try {
      const { id } = call.request;

      const att = await attachmentService.getById(id, call.user);

      if (!fs.existsSync(att.storagePath)) {
        throw new AppError(ErrorMessages.MISSING_FILE, 404);
      }

      call.write({
        metadata: {
          originalName: att.originalName,
          mimeType: att.mimeType,
          size: att.size.toString(),
        },
      });

      const stream = fs.createReadStream(att.storagePath, {
        highWaterMark: CHUNK_SIZE,
      });

      for await (const chunk of stream) {
        call.write({ chunk });
      }

      call.end();
    } catch (error) {
      handleGrpcError(error, (err) => {
        if (err) {
          call.destroy(err as Error);
        }
      });
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
