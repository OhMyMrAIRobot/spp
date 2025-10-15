import { GraphQLError } from 'graphql';
import { ZodError } from 'zod';
import { ErrorCodes } from '../constants/error-codes';
import { ErrorMessages } from '../constants/error-messages';

export interface ValidationError {
  path: string;
  message: string;
}

export const formatZodError = (error: ZodError): ValidationError[] => {
  return error.issues.map((err) => ({
    path: err.path.join('.') || 'unknown',
    message: err.message,
  }));
};

export const createValidationError = (error: ZodError): GraphQLError => {
  const errors = formatZodError(error);

  return new GraphQLError(ErrorMessages.VALIDATION_FAILED, {
    extensions: {
      code: ErrorCodes.BAD_USER_INPUT,
      validationErrors: errors,
    },
  });
};
