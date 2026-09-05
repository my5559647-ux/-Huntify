import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import http from 'http';
import { connectDB } from './db';
import leadRoutes from './routes/leadRoutes';
import authRoutes from './routes/authRoutes';
import chatRoutes from './routes/chatRoutes';
import emailRoutes from './routes/emailRoutes';
import { initSocket } from './socket';

const app = express();
const PORT = process.env.PORT || 5000;

// Dynamic CORS configuration (Allows Vercel frontend & Localhost)
const allowedOrigins = [
  'https://huntify-two.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or serverless preflights)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Production safety fallback
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());
app.use(express.json({ limit: '25mb' }));

// Middleware to ensure DB is connected before processing requests
app.use(async (req: Request, res: Response, next: NextFunction) => {
  await connectDB();
  next();
});

// Register routes
app.use('/api/leads', leadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/email', emailRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Huntify Backend is Running Perfectly!');
});

// Create HTTP server and attach Socket.io
const server = http.createServer(app);
initSocket(server);

// Only start listener when running locally, not on Vercel serverless environment
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;