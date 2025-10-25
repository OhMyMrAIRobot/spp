import { configDotenv } from 'dotenv';
import mongoose from 'mongoose';

configDotenv();

const mongoUri = process.env.MONGO_URI || '';

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};
