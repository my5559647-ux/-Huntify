"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const db_1 = require("./db");
const leadRoutes_1 = __importDefault(require("./routes/leadRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const emailRoutes_1 = __importDefault(require("./routes/emailRoutes"));
const socket_1 = require("./socket");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Detect if running on Vercel
const isVercel = process.env.VERCEL || process.env.VERCEL_ENV;
// Define allowed origins for production and development
const allowedOrigins = [
    'https://huntify-two.vercel.app',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
];
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl requests, etc.)
        if (!origin) {
            return callback(null, true);
        }
        // Check if the origin is in the allowed list
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json({ limit: '25mb' }));
app.get('/', (_req, res) => {
    res.send('Huntify Backend is Running Perfectly!');
});
app.get('/api/health', (_req, res) => {
    res.json({ success: true, message: 'Huntify API is healthy.' });
});
app.use(async (req, res, next) => {
    if (req.method === 'OPTIONS') {
        next();
        return;
    }
    try {
        await (0, db_1.connectDB)();
        next();
    }
    catch (error) {
        console.error('Database Connection Error:', error);
        res.status(503).json({ success: false, message: 'Database unavailable. Please try again.' });
    }
});
app.use('/api/leads', leadRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
app.use('/api/chats', chatRoutes_1.default);
app.use('/api/email', emailRoutes_1.default);
// Only create HTTP server and initialize Socket.io if not running on Vercel
if (!isVercel) {
    const server = http_1.default.createServer(app);
    (0, socket_1.initSocket)(server);
    server.listen(PORT, () => {
        console.log(`Server is running live on port ${PORT}`);
    });
}
exports.default = app;
