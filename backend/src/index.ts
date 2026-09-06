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

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow all origins. Reflect the origin so credentials (cookies) still work —
    // 'Access-Control-Allow-Origin: *' is rejected by browsers when credentials are included.
    callback(null, origin ?? true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
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

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running live on port ${PORT}`);
});

export default app;