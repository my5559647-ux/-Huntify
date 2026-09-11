import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected) {
    return;
  }

  try {
    const user = process.env.DB_USER || '';
    const password = process.env.DB_PASSWORD || '';
    const host = process.env.DB_HOST || '';
    const dbName = process.env.DB_NAME || 'test';

    if (!user || !password || !host) {
      throw new Error('MongoDB environment variables (DB_USER, DB_PASSWORD, DB_HOST) are missing!');
    }

const uri = `mongodb+srv://${user}:${password}@${host}/${dbName}?retryWrites=true&w=majority`;
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = !!conn.connections[0].readyState;
    console.log(`✅ MongoDB Connected to Cloud Atlas: ${conn.connection.host}`);
  } catch (error: any) {
    isConnected = false;
    console.error('❌ MongoDB Connection Error Details:', error.message || error);
    throw error;
  }
};