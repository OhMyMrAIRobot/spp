import { Request, Response } from 'express';
import { tokenService } from '../services/token.service';
import { JwtPayload } from '../types/jwt-payload';
import { createDataLoaders } from './dataloaders';

/**
 * GraphQL Context
 * Передается во все резолверы
 *
 * Содержит:
 * - user: авторизованный пользователь (если есть JWT токен)
 * - req/res: Express request/response
 * - loaders: DataLoaders для оптимизации запросов
 */
export interface GraphQLContext {
  user: JwtPayload | undefined;
  req: Request;
  res: Response;
  loaders: ReturnType<typeof createDataLoaders>;
}

/**
 * Интерфейс для аргументов функции создания контекста
 */
export interface ContextFunctionArgument {
  req: Request;
  res: Response;
}

/**
 * Создание контекста для каждого запроса
 *
 * Проверяет JWT токен из заголовка Authorization
 * Формат: "Bearer <token>"
 */
export const createContext = async ({
  req,
  res,
}: ContextFunctionArgument): Promise<GraphQLContext> => {
  let user: JwtPayload | undefined;

  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    if (token) {
      try {
        user = tokenService.verifyAccessToken(token);
      } catch {
        user = undefined;
      }
    }
  }

  return {
    user,
    req,
    res,
    loaders: createDataLoaders(),
  };
};
