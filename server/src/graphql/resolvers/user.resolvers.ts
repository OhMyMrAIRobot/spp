import { userService } from '../../services/user.service';
import { toUserWithoutPassword } from '../../utils/common';
import { GraphQLContext } from '../context';
import { requireAdmin } from '../utils/auth-guards';

export const userResolvers = {
  Query: {
    users: async (_: unknown, __: unknown, context: GraphQLContext) => {
      requireAdmin(context);

      const users = await userService.getAll();
      return users.map((u) => toUserWithoutPassword(u));
    },
  },
};
