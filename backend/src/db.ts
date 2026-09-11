import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected) {
    return;
  }

  try {
    // Direct connection string yahan rakh do taake Vercel dashboard ki zaroorat hi na pade
    const uri = "mongodb+srv://my5559647_huntify-db:huntify123@cluster0.apyguus.mongodb.net/?appName=Cluster0";

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