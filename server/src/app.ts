import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { authenticate } from './middlewares/auth.middleware';
import { errorHandler } from './middlewares/error-handler';
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import taskRoutes from './routes/task.routes';
import userRoutes from './routes/user.routes';

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use('/projects', authenticate, projectRoutes);
app.use('/tasks', authenticate, taskRoutes);
app.use('/users', authenticate, userRoutes);
app.use('/auth', authRoutes);

app.use(errorHandler);

export default app;
