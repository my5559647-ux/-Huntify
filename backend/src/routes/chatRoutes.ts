import { Router } from 'express';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { Types } from 'mongoose';

const router = Router();

/**
 * GET /api/chats/conversations?userId=<id>
 * Returns all conversations for a user, each with the other participant's
 * info, the last message preview, and the unread count.
 */
router.get('/conversations', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      res.status(400).json({ success: false, message: 'userId query param is required.' });
      return;
    }

    const conversations = await Conversation.find({
      participants: new Types.ObjectId(String(userId)),
    })
      .sort({ lastMessageAt: -1 })
      .populate('participants', 'name email avatar');

    // Augment with last message + unread count
    const result = await Promise.all(
      conversations.map(async (conv: any) => {
        const other = conv.participants.find(
          (p: any) => String(p._id) !== String(userId)
        );
        const lastMsg = await Message.findOne({ conversation: conv._id })
          .sort({ createdAt: -1 })
          .lean();
        const unread = await Message.countDocuments({
          conversation: conv._id,
          sender: { $ne: userId },
          read: false,
        });
        return {
          id: conv._id,
          participant: other
            ? { id: other._id, name: other.name, avatar: other.avatar }
            : null,
          lastMessage: lastMsg?.fileURL ? `📎 ${lastMsg.fileName}` : (lastMsg?.text || conv.lastMessage || ''),
          lastMessageAt: lastMsg?.createdAt || conv.lastMessageAt,
          unread,
        };
      })
    );

    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    console.error('List conversations error:', error?.message || error);
    res.status(500).json({ success: false, message: 'Failed to load conversations.' });
  }
});

/**
 * GET /api/chats/find?from=<userIdA>&to=<userIdB>
 * Find-or-create a 1:1 conversation between two users. Creates one if none exists.
 */
router.get('/find', async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) {
      res.status(400).json({ success: false, message: 'from and to query params are required.' });
      return;
    }

    const [a, b] = [String(from), String(to)].sort();

    let conversation = await Conversation.findOne({ participantA: a, participantB: b });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [a, b],
        participantA: a,
        participantB: b,
      });
    }

    res.status(200).json({ success: true, data: { id: conversation._id } });
  } catch (error: any) {
    console.error('Find conversation error:', error?.message || error);
    res.status(500).json({ success: false, message: 'Failed to find conversation.' });
  }
});

/**
 * GET /api/chats/:conversationId/messages
 * Returns the full message history for a conversation.
 */
router.get('/:conversationId/messages', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversation: conversationId })
      .sort({ createdAt: 1 })
      .populate('sender', 'name email avatar')
      .lean();
    res.status(200).json({ success: true, data: messages });
  } catch (error: any) {
    console.error('List messages error:', error?.message || error);
    res.status(500).json({ success: false, message: 'Failed to load messages.' });
  }
});

/**
 * POST /api/chats/upload
 * Accepts a JSON body { fileName, fileSize, fileType, data } where `data` is a
 * Base64 data URL. Returns a fileURL. (No external storage dependency needed.)
 */
router.post('/upload', (req, res) => {
  try {
    const { fileName, fileType, data } = req.body || {};
    if (!data) {
      res.status(400).json({ success: false, message: 'No file data provided.' });
      return;
    }
    // For a demo, we store the data URL directly. In production, upload to S3/Cloudinary.
    res.status(200).json({
      success: true,
      data: { url: data, name: fileName || 'attachment', type: fileType || 'FILE' },
    });
  } catch (error: any) {
    console.error('Upload error:', error?.message || error);
    res.status(500).json({ success: false, message: 'Upload failed.' });
  }
});

/**
 * POST /api/chats/seed
 * Creates demo users + a conversation + sample messages so the UI has
 * something to show before real users chat. Idempotent-ish (by email).
 */
router.post('/seed', async (_req, res) => {
  try {
    const demoUsers = [
      { name: 'Lahore Gourmet Bakers & Cafe', email: 'cafe@huntify.demo' },
      { name: 'Al-Madina Auto Spare Parts', email: 'auto@huntify.demo' },
      { name: 'Zenith Tech Software House', email: 'zenith@huntify.demo' },
      { name: 'Glamour Bridal Studio & Salon', email: 'glamour@huntify.demo' },
    ];

    const createdUsers = [];
    for (const u of demoUsers) {
      let user = await User.findOne({ email: u.email });
      if (!user) {
        user = await User.create({
          name: u.name,
          email: u.email,
          password: 'huntifydemo123',
          avatar: '',
        });
      }
      createdUsers.push(user);
    }

    // Create a conversation between first and second demo user
    const [a, b] = createdUsers;
    const [pa, pb] = [String(a._id), String(b._id)].sort();
    let conv = await Conversation.findOne({ participantA: pa, participantB: pb });
    if (!conv) {
      conv = await Conversation.create({
        participants: [pa, pb],
        participantA: pa,
        participantB: pb,
      });
    }

    const sampleMessages = [
      { text: 'Hi! We received your website audit report. Impressive insights!' },
      { text: 'Thank you! I noticed your mobile menu needs a redesign for better conversions.' },
      { text: 'Interesting. Can you share a proposal with pricing?' },
    ];

    for (let i = 0; i < sampleMessages.length; i++) {
      const exists = await Message.exists({
        conversation: conv._id,
        text: sampleMessages[i].text,
      });
      if (!exists) {
        await Message.create({
          conversation: conv._id,
          sender: i % 2 === 0 ? a._id : b._id,
          text: sampleMessages[i].text,
        });
      }
    }

    // Update conversation preview
    conv.lastMessage = sampleMessages[sampleMessages.length - 1].text;
    conv.lastMessageAt = new Date();
    await conv.save();

    res.status(200).json({
      success: true,
      message: 'Demo chat seeded successfully.',
      data: { conversationId: conv._id, users: createdUsers.map((u) => ({ id: u._id, name: u.name })) },
    });
  } catch (error: any) {
    console.error('Seed error:', error?.message || error);
    res.status(500).json({ success: false, message: 'Seed failed.' });
  }
});

export default router;
