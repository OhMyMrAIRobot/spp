import fs from 'fs/promises';
import { GraphQLError } from 'graphql';
import { FileUpload } from 'graphql-upload';
import path from 'path';
import { MAX_FILES_COUNT, MAX_FILE_SIZE } from '../../constants/constants';
import { ErrorCodes } from '../../constants/error-codes';
import { ErrorMessages } from '../../constants/error-messages';
import { attachmentService } from '../../services/attachment.service';
import { UploadedFile } from '../../types/uploaded-file';
import { GraphQLContext } from '../context';
import { requireAuth } from '../utils/auth-guards';

const ALLOWED_MIME = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'application/pdf',
  'text/plain',
  'application/zip',
  'application/x-zip-compressed',
]);

const cleanupFiles = async (filePaths: string[]): Promise<void> => {
  await Promise.all(
    filePaths.map(async (filepath) => {
      try {
        await fs.unlink(filepath);
      } catch (err: any) {
        if (err.code !== 'ENOENT') {
          console.error('Failed to delete:', filepath, err.message);
        }
      }
    }),
  );
};

export const attachmentResolvers = {
  Query: {
    attachmentsByTask: async (
      _: unknown,
      { taskId }: { taskId: string },
      context: GraphQLContext,
    ) => {
      const user = requireAuth(context);
      try {
        const att = await attachmentService.getByTaskId(taskId, user);
        return att;
      } catch (err: any) {
        throw new GraphQLError(
          err.message || ErrorMessages.ATTACHMENT_NOT_FOUND,
          {
            extensions: {
              code:
                err.message === ErrorMessages.FORBIDDEN
                  ? ErrorCodes.FORBIDDEN
                  : ErrorCodes.BAD_USER_INPUT,
            },
          },
        );
      }
    },

    attachment: async (
      _: unknown,
      { id }: { id: string },
      context: GraphQLContext,
    ) => {
      const user = requireAuth(context);
      try {
        const att = await attachmentService.getById(id, user);
        return att;
      } catch (err: any) {
        throw new GraphQLError(
          err.message || ErrorMessages.ATTACHMENT_NOT_FOUND,
          {
            extensions: {
              code:
                err.message === ErrorMessages.FORBIDDEN
                  ? ErrorCodes.FORBIDDEN
                  : ErrorCodes.BAD_USER_INPUT,
            },
          },
        );
      }
    },
  },

  Mutation: {
    uploadAttachments: async (
      _: unknown,
      { taskId, files }: { taskId: string; files: Promise<FileUpload>[] },
      context: GraphQLContext,
    ) => {
      const user = requireAuth(context);

      if (!files || files.length === 0) {
        throw new GraphQLError('No files provided', {
          extensions: { code: ErrorCodes.BAD_USER_INPUT },
        });
      }

      if (files.length > MAX_FILES_COUNT) {
        throw new GraphQLError(`Max ${MAX_FILES_COUNT} files allowed`, {
          extensions: { code: ErrorCodes.BAD_USER_INPUT },
        });
      }

      const savedFilePaths: string[] = [];

      try {
        const resolvedFiles = await Promise.all(files);

        const uploadedFiles: UploadedFile[] = [];

        for (const file of resolvedFiles) {
          if (!ALLOWED_MIME.has(file.mimetype)) {
            throw new GraphQLError(`Unsupported file type: ${file.mimetype}`, {
              extensions: { code: ErrorCodes.BAD_USER_INPUT },
            });
          }

          const baseDir =
            process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
          const dir = path.join(baseDir, 'tasks', taskId);
          await fs.mkdir(dir, { recursive: true });

          const ext = path.extname(file.filename);
          const filename = `${Date.now()}-${Math.random().toString(16).slice(2)}${ext}`;
          const filepath = path.join(dir, filename);

          const stream = file.createReadStream();
          const writeStream = require('fs').createWriteStream(filepath);

          let size = 0;
          for await (const chunk of stream) {
            size += chunk.length;
            if (size > MAX_FILE_SIZE) {
              await fs.unlink(filepath).catch(() => {});
              throw new GraphQLError('File too large. Max is 20MB', {
                extensions: { code: ErrorCodes.BAD_USER_INPUT },
              });
            }
            writeStream.write(chunk);
          }

          writeStream.end();

          savedFilePaths.push(filepath);
          uploadedFiles.push({
            originalname: file.filename,
            mimetype: file.mimetype,
            size,
            path: filepath,
          });
        }

        const att = await attachmentService.create(taskId, uploadedFiles, user);
        return att;
      } catch (err: any) {
        if (savedFilePaths.length > 0) {
          await cleanupFiles(savedFilePaths);
        }

        throw new GraphQLError(
          err.message || ErrorMessages.FAILED_UPLOAD_ATTACHMENT,
          {
            extensions: {
              code:
                err.message === ErrorMessages.FORBIDDEN
                  ? ErrorCodes.FORBIDDEN
                  : ErrorCodes.BAD_USER_INPUT,
            },
          },
        );
      }
    },

    deleteAttachment: async (
      _: unknown,
      { id }: { id: string },
      context: GraphQLContext,
    ) => {
      const user = requireAuth(context);
      try {
        await attachmentService.deleteById(id, user);
        return true;
      } catch (err: any) {
        throw new GraphQLError(
          err.message || ErrorMessages.FAILED_DELETE_ATTACHMENT,
          {
            extensions: {
              code:
                err.message === ErrorMessages.FORBIDDEN
                  ? ErrorCodes.FORBIDDEN
                  : ErrorCodes.BAD_USER_INPUT,
            },
          },
        );
      }
    },
  },
};
