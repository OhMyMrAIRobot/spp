import { GraphQLFormattedError } from 'graphql';
import { ErrorCodes } from '../constants/error-codes';
import { ErrorMessages } from '../constants/error-messages';

export const formatError = (
  formattedError: GraphQLFormattedError,
): GraphQLFormattedError => {
  if (formattedError.extensions?.validationErrors) {
    return {
      message: ErrorMessages.VALIDATION_FAILED,
      extensions: {
        code: ErrorCodes.BAD_USER_INPUT,
        errors: formattedError.extensions.validationErrors,
      },
    };
  }

  return {
    message: formattedError.message,
    extensions: {
      code: formattedError.extensions?.code || ErrorCodes.INTERNAL_SERVER_ERROR,
    },
    ...(formattedError.path && { path: formattedError.path }),
  };
};
