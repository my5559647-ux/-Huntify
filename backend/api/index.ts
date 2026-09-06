import { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/index';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers for Vercel serverless
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  return app(req, res);
}
