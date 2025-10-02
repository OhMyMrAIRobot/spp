import z from 'zod';

const usernameRegex = /^[a-zA-Z0-9_]+$/;

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot exceed 20 characters')
    .regex(
      usernameRegex,
      'Username can only contain letters, numbers and underscores',
    ),
  password: z.string().min(8, 'Password can`t be less than 8 symbols!'),
});

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot exceed 20 characters')
    .regex(
      usernameRegex,
      'Username can only contain letters, numbers and underscores',
    ),
  password: z.string().min(8, 'Password can`t be less than 8 symbols!'),
});
