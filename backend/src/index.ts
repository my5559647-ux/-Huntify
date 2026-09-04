import express from 'express';
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

app.use(cors({
  origin: ['https://huntify-production-7c9c.up.railway.app', 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json({ limit: '25mb' })); // allow base64 file uploads

// Connect to MongoDB
connectDB();

// Register routes
app.use('/api/leads', leadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/email', emailRoutes);

app.get('/', (req, res) => {
  res.send('Huntify Backend is Running Perfectly!');
});

// Create HTTP server and attach Socket.io for real-time chat
const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;