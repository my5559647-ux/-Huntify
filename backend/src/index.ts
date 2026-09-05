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

// Enable CORS for ALL origins and ALL preflight requests immediately
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

app.options('*', cors());

app.use(express.json({ limit: '25mb' }));

app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database Connection Error:", error);
    next(error);
  }
});

app.use('/api/leads', leadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/email', emailRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Huntify Backend is Running Perfectly!');
});

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running live on port ${PORT}`);
});

export default app;