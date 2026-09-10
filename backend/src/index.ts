import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import http from 'http';
import { connectDB } from './db';
import leadRoutes from './routes/leadRoutes';
import authRoutes from './routes/authRoutes';
import chatRoutes from './routes/chatRoutes';
import emailRoutes from './routes/emailRoutes';
import { initSocket } from './socket';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Detect if running on Vercel
const isVercel = process.env.VERCEL || process.env.VERCEL_ENV;

// Define allowed origins for production and development
const allowedOrigins = [
  'https://huntify-two.vercel.app',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl requests, etc.)
    if (!origin) {
      return callback(null, true);
    }
    // Check if the origin is in the allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '25mb' }));

app.get('/', (_req: Request, res: Response) => {
  res.send('Huntify Backend is Running Perfectly!');
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Huntify API is healthy.' });
});

app.use(async (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'OPTIONS') {
    next();
    return;
  }
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database Connection Error:', error);
    res.status(503).json({ success: false, message: 'Database unavailable. Please try again.' });
  }
});

app.use('/api/leads', leadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/email', emailRoutes);

// Only create HTTP server and initialize Socket.io if not running on Vercel
if (!isVercel) {
  const server = http.createServer(app);
  initSocket(server);
  server.listen(PORT, () => {
    console.log(`Server is running live on port ${PORT}`);
  });
}

export default app;