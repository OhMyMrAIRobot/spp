import app from './app';
import config from './config/config';
import { connectDB } from './database';

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});

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

tryConnectDB();
