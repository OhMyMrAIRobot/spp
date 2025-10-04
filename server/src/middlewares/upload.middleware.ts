import type { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import multer, { MulterError } from 'multer';
import path from 'path';
import { AppError } from '../types/http/error/app-error';

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const MAX_FILES_COUNT = 10;

const ALLOWED_MIME = new Set<string>([
  'image/png',
  'image/jpeg',
  'image/webp',
  'application/pdf',
  'text/plain',
  'application/zip',
  'application/x-zip-compressed',
]);

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const taskId = (req.params as any).taskId as string;
    const baseDir =
      process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
    const dir = path.join(baseDir, 'tasks', taskId);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(16).slice(2)}${ext}`;
    cb(null, name);
  },
});

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (ALLOWED_MIME.has(file.mimetype)) {
    return cb(null, true);
  }
  return cb(new AppError(`Unsupported file type: ${file.mimetype}`, 400));
};

const baseMulter = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES_COUNT,
  },
});

function wrapMulter(
  mw: (req: Request, res: Response, cb: (err?: any) => void) => void,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    mw(req, res, (err?: any) => {
      if (!err) return next();

      if (err instanceof MulterError) {
        switch (err.code) {
          case 'LIMIT_FILE_SIZE':
            return next(
              new AppError(
                `File too large. Max per file is ${Math.floor(MAX_FILE_SIZE / (1024 * 1024))}MB`,
                413,
              ),
            );
          case 'LIMIT_FILE_COUNT':
            return next(
              new AppError(`Too many files. Max is ${MAX_FILES_COUNT}`, 413),
            );
          default:
            return next(new AppError('Upload failed', 400));
        }
      }

      if (err instanceof AppError) return next(err);
      return next(new AppError('Upload failed', 400));
    });
  };
}

export const uploadMultiple = wrapMulter(
  baseMulter.array('files', MAX_FILES_COUNT),
);
