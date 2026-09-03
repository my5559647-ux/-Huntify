'use client';

import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://huntify-production-7c9c.up.railway.app';

// Singleton socket instance so we don't create multiple connections across the app.
let socket: Socket | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

export function getSocket(userId?: string): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      query: userId ? { userId } : undefined,
      reconnection: true,
      reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    // Handle connection errors
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      reconnectAttempts++;
      if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.error('Max reconnection attempts reached');
      }
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        socket?.connect();
      }
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
      reconnectAttempts = 0;
    });
  }
  return socket;
}

export function connectSocket(userId?: string): Socket {
  const s = getSocket(userId);
  if (!s.connected) {
    reconnectAttempts = 0;
    s.connect();
  }
  return s;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
    reconnectAttempts = 0;
  }
}

// Handle page visibility changes to manage socket connections
export function handleVisibilityChange(userId?: string) {
  if (typeof document === 'undefined') return;

  const handleVisibility = () => {
    if (document.hidden) {
      // Page is hidden, disconnect socket to prevent cache issues
      console.log('Page hidden, disconnecting socket');
      disconnectSocket();
    } else {
      // Page is visible again, reconnect socket
      console.log('Page visible, reconnecting socket');
      if (userId) {
        connectSocket(userId);
      }
    }
  };

  document.addEventListener('visibilitychange', handleVisibility);

  // Return cleanup function
  return () => {
    document.removeEventListener('visibilitychange', handleVisibility);
  };
}
