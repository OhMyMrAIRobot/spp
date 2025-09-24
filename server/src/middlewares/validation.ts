import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodTypeAny } from 'zod';
import type { ApiResponse } from '../types/http/response/api.response';

export const validate =
  (schema: ZodTypeAny, target: 'body' | 'params' | 'query' = 'body') =>
  (req: Request, res: Response<ApiResponse<unknown>>, next: NextFunction) => {
    try {
      const parsed = schema.parse(req[target]);
      (req as any)[target] = parsed;
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.issues.map((issue) => ({
          path: issue.path.join('.') || target,
          message: issue.message,
        }));
        return res.status(400).json({ message: 'Validation error', errors });
      }
      return next(err);
    }
  };
