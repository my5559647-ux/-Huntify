import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected) {
    return;
  }

  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_DB;

    if (!uri) {
      throw new Error('MONGODB_URI is missing in .env file!');
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = !!conn.connections[0].readyState;
    console.log(`✅ MongoDB Connected to Cloud Atlas: ${conn.connection.host}`);
  } catch (error: any) {
    console.error('❌ MongoDB Connection Error Details:', error.message || error);
  }
};