import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodObject } from 'zod';
import { ApiResponse } from '../types/http/response/api.response';

export const validate =
  (schema: ZodObject) =>
  (req: Request, res: Response<ApiResponse<null>>, next: NextFunction) => {
    try {
      schema.parse(req.body);
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          message: 'Validation error',
          errors: err.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        });
      }

      return res.status(500).json({
        message: 'Internal validation error',
      });
    }
  };
