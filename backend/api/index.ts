import { createServer } from 'http';
import app from '../src/index';

const server = createServer(app);

export default function handler(req, res) {
  server.emit('request', req, res);
}
