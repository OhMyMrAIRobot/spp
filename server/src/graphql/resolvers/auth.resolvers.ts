import { GraphQLError } from 'graphql';
import { ZodError } from 'zod';
import { ErrorCodes } from '../../constants/error-codes';
import { ErrorMessages } from '../../constants/error-messages';
import { authService } from '../../services/auth.service';
import { UserRoleEnum } from '../../types/user/user-role';
import { createValidationError } from '../../utils/zod-errors';
import { loginSchema, registerSchema } from '../../validations/auth.validation';
import { GraphQLContext } from '../context';
import { LoginInput, RegisterInput } from '../inputs/auth.inputs';

const cookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: 'lax' as const,
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

export const authResolvers = {
  Mutation: {
    register: async (
      _: unknown,
      { input }: RegisterInput,
      context: GraphQLContext,
    ) => {
      try {
        registerSchema.parse(input);

        const { accessToken, refreshToken, user } = await authService.register(
          input.username,
          input.password,
          UserRoleEnum.MEMBER,
        );

        context.res.cookie('refreshToken', refreshToken, cookieOptions);

        return { token: accessToken, user };
      } catch (err: any) {
        if (err instanceof ZodError) {
          throw createValidationError(err);
        }

        throw new GraphQLError(
          err.message || ErrorMessages.REGISTRATION_FAILED,
          {
            extensions: { code: ErrorCodes.BAD_USER_INPUT },
          },
        );
      }
    },

    login: async (
      _: unknown,
      { input }: LoginInput,
      context: GraphQLContext,
    ) => {
      try {
        loginSchema.parse(input);

        const { accessToken, refreshToken, user } = await authService.login(
          input.username,
          input.password,
        );

        context.res.cookie('refreshToken', refreshToken, cookieOptions);

        return { token: accessToken, user };
      } catch (err: any) {
        if (err instanceof ZodError) {
          throw createValidationError(err);
        }

        throw new GraphQLError(err.message || ErrorMessages.LOGIN_FAILED, {
          extensions: { code: ErrorCodes.BAD_USER_INPUT },
        });
      }
    },

    refresh: async (_: unknown, __: unknown, context: GraphQLContext) => {
      try {
        const oldToken = context.req.cookies['refreshToken'];

        if (!oldToken) {
          throw new GraphQLError(ErrorMessages.TOKEN_MISSING, {
            extensions: { code: ErrorCodes.UNAUTHENTICATED },
          });
        }

        const { accessToken, refreshToken, user } =
          await authService.refresh(oldToken);

        context.res.cookie('refreshToken', refreshToken, cookieOptions);

        return { token: accessToken, user };
      } catch (err: any) {
        throw new GraphQLError(err.message || ErrorMessages.REFRESH_FAILED, {
          extensions: { code: ErrorCodes.UNAUTHENTICATED },
        });
      }
    },

    logout: async (_: unknown, __: unknown, context: GraphQLContext) => {
      if (!context.user) {
        throw new GraphQLError(ErrorMessages.UNAUTHORIZED, {
          extensions: { code: ErrorCodes.UNAUTHENTICATED },
        });
      }

      await authService.logout(context.user.id);

      context.res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      });

      return true;
    },
  },
};
