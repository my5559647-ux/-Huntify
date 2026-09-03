import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Ensure env variables are loaded

export const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_DB;
    
    if (!uri) {
      throw new Error('MONGODB_URI is missing in .env file!');
    }

    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected to Cloud Atlas: ${conn.connection.host}`);
  } catch (error: any) {
    console.error('❌ MongoDB Connection Error Details:', error.message || error);
  }
};