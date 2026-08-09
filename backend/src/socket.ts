import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import Conversation from './models/Conversation.js';
import Message from './models/Message.js';

/**
 * Initializes the real-time Socket.io server.
 *
 * Routing model:
 *  - On connect, the frontend passes `userId`. The socket joins a personal
 *    room `user:<userId>` so direct pushes can target a specific user.
 *  - When a user opens a conversation, the frontend emits `conversation:join`
 *    with the conversation id, joining room `conv:<conversationId>`.
 *  - When a message is sent, we persist it to MongoDB, update the conversation,
 *    then emit `message:new` to the `conv:<id>` room. Because both participants
 *    have joined that room, the message is delivered instantly to the other user
 *    without any page reload.
 */
export function initSocket(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    // The client sends { userId } on connect so we can route private messages.
    const userId = (socket.handshake.query.userId as string) || '';

    if (userId) {
      socket.join(`user:${userId}`);
    }

    // Client joins a conversation room to receive real-time messages.
    socket.on('conversation:join', (conversationId: string) => {
      if (conversationId) socket.join(`conv:${conversationId}`);
    });

    socket.on('conversation:leave', (conversationId: string) => {
      if (conversationId) socket.leave(`conv:${conversationId}`);
    });

    // Handle sending a new message (text or file).
    socket.on('message:send', async (payload, ack) => {
      try {
        const { conversationId, senderId, text, file } = payload || {};

        if (!conversationId || !senderId) {
          ack?.({ success: false, error: 'conversationId and senderId are required.' });
          return;
        }

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          ack?.({ success: false, error: 'Conversation not found.' });
          return;
        }

        const message = await Message.create({
          conversation: conversationId,
          sender: senderId,
          text: text ?? '',
          fileURL: file?.url ?? '',
          fileName: file?.name ?? '',
          fileSize: file?.size ?? 0,
          fileType: file?.type ?? '',
        });

        // Update the sidebar preview on the conversation
        conversation.lastMessage = message.fileURL ? `📎 ${message.fileName}` : message.text;
        conversation.lastMessageAt = new Date();
        await conversation.save();

        const populated = await Message.findById(message._id)
          .populate('sender', 'name email avatar')
          .lean();

        // Broadcast to the conversation room (both participants see it live)
        io.to(`conv:${conversationId}`).emit('message:new', populated);

        ack?.({ success: true, message: populated });
      } catch (error: any) {
        console.error('Socket message:send error:', error?.message || error);
        ack?.({ success: false, error: 'Failed to send message.' });
      }
    });

    // Mark messages as read for a given conversation.
    socket.on('message:read', async (conversationId, readerId) => {
      try {
        await Message.updateMany(
          { conversation: conversationId, sender: { $ne: readerId }, read: false },
          { $set: { read: true } }
        );
        io.to(`conv:${conversationId}`).emit('messages:read', { conversationId, readerId });
      } catch (error: any) {
        console.error('Socket message:read error:', error?.message || error);
      }
    });

    socket.on('typing', (conversationId, name) => {
      socket.to(`conv:${conversationId}`).emit('typing', { conversationId, name });
    });

    socket.on('disconnect', () => {
      if (userId) socket.leave(`user:${userId}`);
    });
  });

  return io;
}
