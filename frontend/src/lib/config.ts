// Centralized API configuration
// Prefer NEXT_PUBLIC_API_URL (Vercel env). Fallback is the Railway production API.
const PRODUCTION_API_URL = 'https://huntify-production-7c9c.up.railway.app';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || PRODUCTION_API_URL).replace(/\/$/, '');

export const API_URL = API_BASE;
export const SOCKET_URL = (process.env.NEXT_PUBLIC_SOCKET_URL || API_BASE).replace(/\/$/, '');
