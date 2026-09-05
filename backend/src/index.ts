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

// Force custom CORS preflight headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

app.use(cors({ origin: true, credentials: true }));
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
