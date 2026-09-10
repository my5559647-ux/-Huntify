"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const crypto_1 = require("crypto");
const User_1 = __importDefault(require("../models/User"));
// ─── Secure password helpers using Node's built-in scrypt (no extra deps) ───
// Format: salt:hash  (both hex-encoded)
const hashPassword = (password) => {
    const salt = (0, crypto_1.randomBytes)(16).toString('hex');
    const hash = (0, crypto_1.scryptSync)(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
};
const verifyPassword = (password, stored) => {
    const [salt, hash] = stored.split(':');
    if (!salt || !hash)
        return false;
    const hashBuffer = Buffer.from(hash, 'hex');
    const verifyBuffer = (0, crypto_1.scryptSync)(password, salt, 64);
    if (hashBuffer.length !== verifyBuffer.length)
        return false;
    return (0, crypto_1.timingSafeEqual)(hashBuffer, verifyBuffer);
};
const publicUser = (user) => ({
    id: String(user._id),
    name: user.name,
    email: user.email,
    avatar: user.avatar || '',
    createdAt: user.createdAt,
});
const signup = async (req, res) => {
    try {
        const { name, email, password, avatar } = req.body || {};
        if (!name || !email || !password) {
            res.status(400).json({ success: false, message: 'Name, email and password are required.' });
            return;
        }
        if (String(password).length < 6) {
            res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
            return;
        }
        // Check if email already exists
        const existing = await User_1.default.findOne({ email: email.toLowerCase() });
        if (existing) {
            res.status(409).json({ success: false, message: 'An account with this email already exists.' });
            return;
        }
        // Hash the password and save the new user
        const user = await User_1.default.create({
            name,
            email: email.toLowerCase(),
            password: hashPassword(password),
            avatar: avatar || '',
        });
        res.status(201).json({
            success: true,
            message: 'Account created successfully.',
            user: publicUser(user),
        });
    }
    catch (error) {
        // Handle duplicate-key race condition gracefully
        if (error && error.code === 11000) {
            res.status(409).json({ success: false, message: 'An account with this email already exists.' });
            return;
        }
        console.error('Signup error:', error?.message || error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) {
            res.status(400).json({ success: false, message: 'Email and password are required.' });
            return;
        }
        const user = await User_1.default.findOne({ email: email.toLowerCase() });
        if (!user) {
            res.status(401).json({ success: false, message: 'Invalid email or password.' });
            return;
        }
        const valid = verifyPassword(password, user.password);
        if (!valid) {
            res.status(401).json({ success: false, message: 'Invalid email or password.' });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Login successful.',
            user: publicUser(user),
        });
    }
    catch (error) {
        console.error('Login error:', error?.message || error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};
exports.login = login;
