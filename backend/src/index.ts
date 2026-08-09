import express from 'express';
import cors from 'cors';
import http from 'http';
import { connectDB } from './db.js';
import leadRoutes from './routes/leadRoutes.js';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { initSocket } from './socket.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '25mb' })); // allow base64 file uploads

// Connect to MongoDB
connectDB();

// Register routes
app.use('/api/leads', leadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);

app.get('/', (req, res) => {
  res.send('Huntify Backend is Running Perfectly!');
});

// Create HTTP server and attach Socket.io for real-time chat
const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
