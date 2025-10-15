import dotenv from 'dotenv';
import { startServer } from './app';
import config from './config/config';
import { connectDB } from './database';

dotenv.config();

const PORT = config.port || 4000;

const tryConnectDB = async (retries = 5, delay = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await connectDB();
      console.log('MongoDB connected successfully');
      return;
    } catch (err) {
      console.error(
        `MongoDB connection attempt ${i + 1}/${retries} failed. Retrying in ${delay / 1000}s...`,
      );
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  console.error('Failed to connect to MongoDB after several attempts');
  process.exit(1);
};

const start = async () => {
  try {
    tryConnectDB();
    const httpServer = await startServer();

    httpServer.listen(PORT, () => {
      console.log('Server is working!');
    });

    const shutdown = async (signal: string) => {
      console.log(`\n${signal} signal received: closing HTTP server`);

      httpServer.close(() => {
        console.log('HTTP server closed');
      });

      try {
        const mongoose = await import('mongoose');
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
      } catch (err) {
        console.error('Error closing MongoDB connection:', err);
      }

      process.exit(0);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
};

// Запускаем сервер
start();
