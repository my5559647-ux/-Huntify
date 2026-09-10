import { createServer, IncomingMessage, ServerResponse } from 'http';
import app from '../src/index';

const server = createServer(app);

export default function handler(req: IncomingMessage, res: ServerResponse) {
  server.emit('request', req, res);
}
