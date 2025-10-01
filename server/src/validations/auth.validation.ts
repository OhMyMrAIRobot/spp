import z from 'zod';

export const registerSchema = z.object({
  username: z.string().min(1, 'Project title is required!'),
  password: z.string().min(8, 'Password can`t be less than 8 symbols!'),
});

export const loginSchema = z.object({
  username: z.string().min(1, 'Project title is required!'),
  password: z.string().min(8, 'Password can`t be less than 8 symbols!'),
});
