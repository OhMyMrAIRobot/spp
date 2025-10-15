import { GraphQLError } from 'graphql';
import { ErrorCodes } from '../../constants/error-codes';
import { ErrorMessages } from '../../constants/error-messages';
import { JwtPayload } from '../../types/jwt-payload';
import { UserRoleEnum } from '../../types/user/user-role';
import { GraphQLContext } from '../context';

export const requireAuth = (context: GraphQLContext): JwtPayload => {
  if (!context.user) {
    throw new GraphQLError(ErrorMessages.UNAUTHORIZED, {
      extensions: { code: ErrorCodes.UNAUTHENTICATED },
    });
  }
  return context.user;
};

export const requireRole = (
  context: GraphQLContext,
  allowedRoles: UserRoleEnum[],
): JwtPayload => {
  const user = requireAuth(context);

  if (!allowedRoles.includes(user.role)) {
    throw new GraphQLError(ErrorMessages.FORBIDDEN, {
      extensions: { code: ErrorCodes.FORBIDDEN },
    });
  }

  return user;
};

export const requireAdmin = (context: GraphQLContext): JwtPayload => {
  return requireRole(context, [UserRoleEnum.ADMIN]);
};
