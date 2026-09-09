// Centralized API configuration
// Uses NEXT_PUBLIC_API_URL environment variable with production fallback
// Backend will be deployed on Vercel as a separate project
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

export const API_URL = API_BASE;
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || '';
