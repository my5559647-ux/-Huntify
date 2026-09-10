"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let isConnected = false;
const connectDB = async () => {
    if (isConnected) {
        return;
    }
    try {
        const uri = process.env.MONGODB_URI || process.env.MONGO_DB;
        if (!uri) {
            throw new Error('MONGODB_URI is missing in .env file!');
        }
        const conn = await mongoose_1.default.connect(uri, {
            serverSelectionTimeoutMS: 5000,
        });
        isConnected = !!conn.connections[0].readyState;
        console.log(`✅ MongoDB Connected to Cloud Atlas: ${conn.connection.host}`);
    }
    catch (error) {
        isConnected = false;
        console.error('❌ MongoDB Connection Error Details:', error.message || error);
        throw error;
    }
};
exports.connectDB = connectDB;
