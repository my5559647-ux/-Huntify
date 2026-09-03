import { Request, Response } from 'express';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import User from '../models/User';

// ─── Secure password helpers using Node's built-in scrypt (no extra deps) ───
// Format: salt:hash  (both hex-encoded)
const hashPassword = (password: string): string => {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
};

const verifyPassword = (password: string, stored: string): boolean => {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const hashBuffer = Buffer.from(hash, 'hex');
  const verifyBuffer = scryptSync(password, salt, 64);
  return timingSafeEqual(hashBuffer, verifyBuffer);
};

export const signup = async (req: Request, res: Response): Promise<void> => {
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
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(409).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }

    // Hash the password and save the new user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashPassword(password),
      avatar: avatar || '',
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    // Handle duplicate-key race condition gracefully
    if (error && error.code === 11000) {
      res.status(409).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }
    console.error('Signup error:', error?.message || error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
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
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error?.message || error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
