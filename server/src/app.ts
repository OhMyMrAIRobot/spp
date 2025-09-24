import cors from 'cors';
import express from 'express';
import { errorHandler } from './middlewares/error-handler';
import projectRoutes from './routes/project.routes';
import taskRoutes from './routes/task.routes';

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  }),
);
app.use(express.json());

app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes);

app.use(errorHandler);

export default app;
