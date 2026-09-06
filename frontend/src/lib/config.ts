// Centralized API configuration
// Uses NEXT_PUBLIC_API_URL environment variable with production fallback
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'https://huntify-production-7c9c.up.railway.app').replace(/\/$/, '');

export const API_URL = API_BASE;
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://huntify-production-7c9c.up.railway.app';
