import { connectDB } from './database';
import { startRPCServer } from './grpc/grpc-server';

const tryConnectDB = async (retries = 5, delay = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await connectDB();
      return;
    } catch (err) {
      console.error(
        `MongoDB connection attempt ${i + 1} failed. Retrying in ${delay / 1000}s...`,
      );
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  console.error('Failed to connect to MongoDB after several attempts');
};

startRPCServer();
tryConnectDB();
