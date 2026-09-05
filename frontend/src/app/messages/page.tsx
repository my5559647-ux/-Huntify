'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { connectSocket, disconnectSocket, handleVisibilityChange } from '@/lib/socket';
import type { Socket } from 'socket.io-client';
import { MessageSquare, ArrowLeft, Paperclip, FileText, Circle, Dot, Send } from 'lucide-react';
import { API_URL, SOCKET_URL } from '@/lib/config';

interface FileMeta {
  name: string;
  size: string;
  type: string;
  url?: string;
}

interface Message {
  id: string;
  sender: 'me' | 'client';
  senderId?: string;
  text: string;
  time: string;
  date: string;
  file?: FileMeta | null;
}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
  lastSeen: string;
  preview: string;
  unread: number;
  role: string;
  messages: Message[];
}

// ─── Mock fallback data (used when backend / socket is offline) ───
const MOCK_CONTACTS: Contact[] = [
  {
    id: 'mock-1',
    name: 'Lahore Gourmet Bakers & Cafe',
    avatar: 'LG',
    status: 'online',
    lastSeen: 'Online now',
    preview: 'Great! Please send the proposal...',
    unread: 2,
    role: 'Web Design Client',
    messages: [
      { id: '1', sender: 'client', text: 'Hi! We received your website audit report. Impressive insights!', time: '10:02 AM', date: 'Today' },
      { id: '2', sender: 'me', text: 'Thank you! I noticed your mobile menu needs a redesign for better conversions.', time: '10:05 AM', date: 'Today' },
      { id: '3', sender: 'client', text: 'Interesting. Can you share a proposal with pricing?', time: '10:08 AM', date: 'Today' },
      { id: '4', sender: 'me', text: 'Absolutely! Attaching the full proposal document below.', time: '10:10 AM', date: 'Today', file: { name: 'Huntify-Proposal.pdf', size: '2.4 MB', type: 'PDF' } },
      { id: '5', sender: 'client', text: 'Great! Please send the proposal...', time: '10:12 AM', date: 'Today' },
    ],
  },
  {
    id: 'mock-2',
    name: 'Al-Madina Auto Spare Parts',
    avatar: 'AM',
    status: 'offline',
    lastSeen: 'Last seen 30 min ago',
    preview: 'Sounds good, let us discuss...',
    unread: 0,
    role: 'Marketing Client',
    messages: [
      { id: '1', sender: 'client', text: 'We are interested in Google Ads setup.', time: 'Yesterday', date: 'Yesterday' },
      { id: '2', sender: 'me', text: 'Perfect! I can build a targeted campaign for the Badami Bagh auto market.', time: 'Yesterday', date: 'Yesterday' },
      { id: '3', sender: 'client', text: 'Sounds good, let us discuss...', time: 'Yesterday', date: 'Yesterday' },
    ],
  },
  {
    id: 'mock-3',
    name: 'Zenith Tech Software House',
    avatar: 'ZT',
    status: 'online',
    lastSeen: 'Online now',
    preview: 'We found the API bug you mentioned.',
    unread: 1,
    role: 'Development Client',
    messages: [
      { id: '1', sender: 'client', text: 'We found the API bug you mentioned. Can you fix it this week?', time: 'Today', date: 'Today' },
      { id: '2', sender: 'me', text: 'Yes, I can patch the routing and optimize the portal by Friday.', time: 'Today', date: 'Today' },
    ],
  },
  {
    id: 'mock-4',
    name: 'Glamour Bridal Studio & Salon',
    avatar: 'GB',
    status: 'offline',
    lastSeen: 'Last seen 2 hours ago',
    preview: 'We loved the cinematic edit!',
    unread: 0,
    role: 'Video Editing Client',
    messages: [
      { id: '1', sender: 'client', text: 'We loved the cinematic edit! Please send the final cut.', time: 'Mon', date: 'Yesterday' },
      { id: '2', sender: 'me', text: 'Here it is! Let me know if you need color tuning.', time: 'Mon', date: 'Yesterday' },
    ],
  },
];

const API = `${API_URL}/api/chats`;

// Helper to derive initials for avatars
const initials = (name: string) =>
  name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

// Format a Date into a friendly time string
const formatTime = (d: Date) =>
  d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const formatDay = (d: Date) => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
};

export default function MessagesPage() {
  const { theme, user } = useAuth();
  const isDarkMode = theme === 'dark';
  const myId = user?.id || 'local-user';

  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [activeContactId, setActiveContactId] = useState<string>('mock-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [draft, setDraft] = useState('');
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);
  const [typingName, setTypingName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const activeConvIdRef = useRef<string | null>(null);

  const activeContact = contacts.find((c) => c.id === activeContactId) || contacts[0];

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ─── Load conversations from backend (fallback to mock) ───
  useEffect(() => {
    let cancelled = false;

    async function loadConversations() {
      try {
        const res = await fetch(`${API}/conversations?userId=${myId}`);
        const json = await res.json();
        if (!json.success) throw new Error('not ok');
        const list = json.data;
        if (!Array.isArray(list) || list.length === 0) {
          // No backend conversations yet — try to seed demo data
          await fetch(`${API}/seed`, { method: 'POST' }).catch(() => {});
          return loadConversations();
        }
        if (cancelled) return;
        setBackendOnline(true);

        // Map backend conversations into the Contact shape
        const mapped: Contact[] = list.map((c: any, idx: number) => ({
          id: c.id,
          name: c.participant?.name || `Contact ${idx + 1}`,
          avatar: initials(c.participant?.name || '??'),
          status: idx % 2 === 0 ? 'online' : 'offline' as 'online' | 'offline',
          lastSeen: c.lastMessageAt ? new Date(c.lastMessageAt).toDateString() : 'Online now',
          preview: c.lastMessage || '',
          unread: c.unread ?? 0,
          role: 'Client',
          messages: [],
        }));
        setContacts(mapped);
        setActiveContactId(mapped[0]?.id || '');
      } catch {
        if (!cancelled) setBackendOnline(false); // keep mock contacts
      }
    }

    loadConversations();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myId]);

  // ─── Load message history when a conversation is selected ───
  useEffect(() => {
    if (!backendOnline) return;
    let cancelled = false;

    async function loadMessages() {
      try {
        const res = await fetch(`${API}/${activeContactId}/messages`);
        const json = await res.json();
        if (!json.success || cancelled) return;
        const msgs = json.data;
        const mapped: Message[] = msgs.map((m: any) => {
          const d = new Date(m.createdAt);
          const isMine = String(m.sender?._id || m.sender) === String(myId);
          return {
            id: String(m._id),
            sender: isMine ? 'me' : 'client',
            senderId: String(m.sender?._id || ''),
            text: m.fileURL ? `Sent file: ${m.fileName}` : (m.text || ''),
            time: formatTime(d),
            date: formatDay(d),
            file: m.fileURL
              ? { name: m.fileName, size: `${m.fileSize} B`, type: m.fileType, url: m.fileURL }
              : null,
          };
        });
        if (cancelled) return;
        setContacts((prev) =>
          prev.map((c) => (c.id === activeContactId ? { ...c, messages: mapped } : c))
        );
      } catch {
        // ignore, keep existing
      }
    }

    loadMessages();
    return () => {
      cancelled = true;
    };
  }, [activeContactId, backendOnline, myId]);

  // ─── Socket.io real-time connection ───
  useEffect(() => {
    if (!user?.id) return;
    const socket = connectSocket(user.id);
    socketRef.current = socket;

    socket.on('connect', () => {
      setBackendOnline(true);
      if (activeConvIdRef.current) {
        socket.emit('conversation:join', activeConvIdRef.current);
      }
    });

    socket.on('message:new', (msg: any) => {
      const convId = String(msg.conversation);
      const isMine = String(msg.sender?._id || msg.sender) === String(user.id);
      const d = new Date(msg.createdAt);
      const newMsg: Message = {
        id: String(msg._id),
        sender: isMine ? 'me' : 'client',
        senderId: String(msg.sender?._id || ''),
        text: msg.fileURL ? `Sent file: ${msg.fileName}` : (msg.text || ''),
        time: formatTime(d),
        date: formatDay(d),
        file: msg.fileURL
          ? { name: msg.fileName, size: `${msg.fileSize} B`, type: msg.fileType, url: msg.fileURL }
          : null,
      };

      setContacts((prev) =>
        prev.map((c) => {
          if (c.id !== convId) return c;
          const isActive = c.id === activeContactId;
          return {
            ...c,
            preview: newMsg.text,
            unread: isMine || isActive ? 0 : c.unread + 1,
            messages: [...c.messages, newMsg],
          };
        })
      );
    });

    socket.on('messages:read', ({ conversationId }: { conversationId: string }) => {
      setContacts((prev) =>
        prev.map((c) => (c.id === conversationId ? { ...c, unread: 0 } : c))
      );
    });

    socket.on('typing', ({ conversationId, name }: { conversationId: string; name: string }) => {
      if (conversationId === activeContactId) setTypingName(name);
    });

    // Handle page visibility changes to prevent Back-Forward Cache issues
    const cleanupVisibility = handleVisibilityChange(user.id);

    return () => {
      socket.off('message:new');
      socket.off('messages:read');
      socket.off('typing');
      socket.off('connect');
      cleanupVisibility?.();
      disconnectSocket();
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, activeContactId]);

  // Join conversation room when switching
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !socket.connected) return;
    if (activeConvIdRef.current) socket.emit('conversation:leave', activeConvIdRef.current);
    activeConvIdRef.current = activeContactId;
    socket.emit('conversation:join', activeContactId);
    socket.emit('message:read', activeContactId, myId);
  }, [activeContactId, myId]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeContact, contacts]);

  // ─── Send text message (real-time via socket, fallback to local) ───
  const sendMessage = useCallback(
    (text?: string, file?: FileMeta) => {
      const content = (text ?? draft).trim();
      if (!content && !file) return;

      const socket = socketRef.current;
      const convId = activeContactId;

      if (socket && socket.connected && backendOnline && convId) {
        socket.emit(
          'message:send',
          {
            conversationId: convId,
            senderId: myId,
            text: content,
            file: file
              ? { url: file.url, name: file.name, size: file.size, type: file.type }
              : undefined,
          },
          (res: any) => {
            if (res?.success) {
              // The socket will broadcast back; optimistic below is replaced by server echo.
            }
          }
        );
      }

      // Optimistic local update (also covers offline fallback)
      const optimistic: Message = {
        id: `local-${Date.now()}`,
        sender: 'me',
        text: file ? `Sent file: ${file.name}` : content,
        time: 'Now',
        date: 'Today',
        file: file || null,
      };

      setContacts((prev) =>
        prev.map((c) =>
          c.id === convId
            ? { ...c, preview: file ? `File: ${file.name}` : content, unread: 0, messages: [...c.messages, optimistic] }
            : c
        )
      );
      setDraft('');
    },
    [draft, activeContactId, myId, backendOnline]
  );

  // ─── File upload handler ───
  const handleFileSend = useCallback(
    async (file: File) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        let fileUrl = dataUrl;
        let meta: FileMeta = {
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          type: file.type.split('/')[1]?.toUpperCase() || 'FILE',
          url: dataUrl,
        };

        // Try to upload to backend for a shareable URL
        if (backendOnline) {
          try {
            const res = await fetch(`${API}/upload`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ fileName: file.name, fileType: file.type, data: dataUrl }),
            });
            const json = await res.json();
            if (json.success) {
              fileUrl = json.data.url || dataUrl;
              meta = { ...meta, url: fileUrl };
            }
          } catch {
            // fall back to local data URL
          }
        }

        sendMessage(undefined, meta);
      };
      reader.readAsDataURL(file);
    },
    [backendOnline, sendMessage]
  );

  const selectContact = (id: string) => {
    setActiveContactId(id);
    setMobileChatOpen(true);
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  };

  return (
<div className={`min-h-screen font-sans transition-colors duration-300 relative overflow-hidden ${isDarkMode ? 'bg-[#05161A] text-[#EAF4F7] selection:bg-[#0C7075] selection:text-white' : 'bg-[#F4FAFC] text-[#0B3C40] selection:bg-[#0C7075] selection:text-white'}`}>

      {/* Ambient Teal/Emerald Background Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-[#0C7075]/20 blur-[150px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-[#6DA5C0]/20 blur-[180px] rounded-full pointer-events-none -z-10"></div>

{/* Shared Navbar */}
      <Navbar active="messages" />

{/* Connection status pill */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold border ${
          backendOnline
            ? isDarkMode ? 'bg-[#072E33]/80 text-[#03F3DA] border-[#0C7075]/60' : 'bg-[#EAF4F7] text-[#0C7075] border-[#B9DDE4]'
            : isDarkMode ? 'bg-[#072E33]/80 text-[#6DA5C0] border-[#294D61]' : 'bg-[#EAF4F7] text-[#0C7075] border-[#B9DDE4]'
        }`}>
          <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-[#03F3DA] animate-pulse' : 'bg-[#6DA5C0]'}`}></span>
          {backendOnline ? 'Real-time connected (Socket.io)' : 'Offline demo mode — start the backend to enable real-time chat'}
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[90px] pb-4 sm:pb-6">
        <div className={`rounded-3xl border shadow-2xl overflow-hidden flex flex-col md:flex-row h-[calc(100vh-13rem)] ${isDarkMode ? 'bg-[#072E33]/90 border-[#294D61]' : 'bg-white border-[#B9DDE4]'}`}>

          {/* ================= LEFT SIDEBAR ================= */}
          <aside className={`w-full md:w-80 lg:w-96 shrink-0 border-b md:border-b-0 md:border-r flex flex-col ${isDarkMode ? 'border-[#294D61]' : 'border-[#B9DDE4]'} ${mobileChatOpen ? 'hidden md:flex' : 'flex'}`}>

            {/* Sidebar Header */}
            <div className={`p-4 border-b ${isDarkMode ? 'border-[#294D61]' : 'border-[#B9DDE4]'}`}>
              <div className="flex items-center justify-between mb-3">
                <h2 className={`font-black text-sm ${isDarkMode ? 'text-white' : 'text-[#0B3C40]'} flex items-center gap-2`}><MessageSquare className="w-4 h-4" /> Messages</h2>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${isDarkMode ? 'bg-[#0C7075] text-white' : 'bg-[#0C7075] text-white'}`}>
                  {contacts.reduce((n, c) => n + c.unread, 0)} unread
                </span>
              </div>
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold border outline-none transition-all ${isDarkMode ? 'bg-[#05161A] border-[#294D61] text-white placeholder:text-[#6DA5C0] focus:border-[#03F3DA]' : 'bg-[#F4FAFC] border-[#B9DDE4] text-[#0B3C40] placeholder:text-[#6DA5C0] focus:border-[#0C7075]'}`}
              />
            </div>

            {/* Contact List */}
            <div className="flex-1 overflow-y-auto">
              {filteredContacts.length > 0 ? filteredContacts.map((contact) => {
                const isActive = contact.id === activeContactId;
                return (
                  <button
                    key={contact.id}
                    onClick={() => selectContact(contact.id)}
                    className={`w-full flex items-start gap-3 p-4 text-left transition-all border-b ${isDarkMode ? 'border-[#294D61]/50 hover:bg-[#05161A]' : 'border-[#D5ECF0] hover:bg-[#EAF4F7]'} ${isActive ? (isDarkMode ? 'bg-[#072E33]' : 'bg-[#D5ECF0]') : ''}`}
                  >
                    <div className="relative shrink-0">
                      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0C7075] to-[#6DA5C0] flex items-center justify-center text-white text-xs font-black shadow`}>
                        {contact.avatar}
                      </div>
                      <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 ${isDarkMode ? 'border-[#072E33]' : 'border-white'} ${contact.status === 'online' ? 'bg-[#03F3DA]' : 'bg-gray-400'}`}></span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center gap-2">
                        <h3 className={`text-xs font-black truncate ${isDarkMode ? 'text-white' : 'text-[#0B3C40]'}`}>{contact.name}</h3>
                        {contact.unread > 0 && (
                          <span className="w-5 h-5 shrink-0 rounded-full bg-[#0C7075] text-white text-[9px] font-black flex items-center justify-center">
                            {contact.unread}
                          </span>
                        )}
                      </div>
                      <p className={`text-[11px] font-semibold truncate mt-0.5 ${isDarkMode ? 'text-[#A9C6D4]' : 'text-[#294D61]'}`}>{contact.preview}</p>
                      <p className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-[#6DA5C0]' : 'text-[#6DA5C0]'}`}>{contact.lastSeen}</p>
                    </div>
                  </button>
                );
              }) : (
                <div className="p-6 text-center text-xs text-[#0C7075] font-bold">No contacts found.</div>
              )}
            </div>
          </aside>

          {/* ================= MAIN CHAT WINDOW ================= */}
          <section className={`flex-1 flex flex-col min-w-0 ${mobileChatOpen ? 'flex' : 'hidden md:flex'}`}>

            {/* Chat Header */}
            <div className={`flex items-center justify-between px-4 py-3 border-b ${isDarkMode ? 'border-[#294D61]' : 'border-[#B9DDE4]'}`}>
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setMobileChatOpen(false)}
                  className={`md:hidden p-2 rounded-xl border ${isDarkMode ? 'bg-[#072E33] border-[#294D61] text-white' : 'bg-[#EAF4F7] border-[#B9DDE4] text-[#0B3C40]'}`}
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-[#0C7075] to-[#6DA5C0] flex items-center justify-center text-white text-xs font-black shadow">
                  {activeContact.avatar}
                </div>
<div className="min-w-0">
                  <h2 className={`text-xs font-black truncate ${isDarkMode ? 'text-white' : 'text-[#0B3C40]'}`}>{activeContact.name}</h2>
                  <p className={`text-[10px] font-semibold ${typingName ? 'text-[#03F3DA]' : (activeContact.status === 'online' ? 'text-[#03F3DA]' : (isDarkMode ? 'text-[#6DA5C0]' : 'text-[#6DA5C0]'))}`}>
                    {typingName ? `${typingName} is typing...` : (activeContact.status === 'online' ? <span className="flex items-center gap-1"><Circle className="w-1.5 h-1.5 fill-[#03F3DA]" /> Online</span> : activeContact.lastSeen)}
                  </p>
                </div>
              </div>
            </div>

            {/* Message History (grouped by date) */}
            <div className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 ${isDarkMode ? 'bg-[#05161A]' : 'bg-[#F4FAFC]'}`}>
              {(() => {
                const groups: { date: string; messages: Message[] }[] = [];
                activeContact.messages.forEach((msg) => {
                  const last = groups[groups.length - 1];
                  if (last && last.date === msg.date) {
                    last.messages.push(msg);
                  } else {
                    groups.push({ date: msg.date, messages: [msg] });
                  }
                });
                return groups.map((group, gi) => (
                  <div key={gi} className="space-y-3">
                    <div className="flex items-center justify-center gap-3">
                      <div className={`h-px flex-1 ${isDarkMode ? 'bg-[#294D61]' : 'bg-[#B9DDE4]'}`}></div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${isDarkMode ? 'bg-[#072E33] text-[#03F3DA]' : 'bg-[#D5ECF0] text-[#0C7075]'}`}>
                        {group.date}
                      </span>
                      <div className={`h-px flex-1 ${isDarkMode ? 'bg-[#294D61]' : 'bg-[#B9DDE4]'}`}></div>
                    </div>

                    {group.messages.map((msg) => {
                      const isMine = msg.sender === 'me';
                      return (
                        <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] sm:max-w-[65%] space-y-1.5`}>
                            <div className={`flex items-center gap-2 ${isMine ? 'flex-row-reverse' : ''}`}>
                              <span className={`text-[10px] font-bold shrink-0 ${isMine ? 'text-[#03F3DA]' : (isDarkMode ? 'text-[#A9C6D4]' : 'text-[#294D61]')}`}>
                                {isMine ? 'You' : activeContact.name}
                              </span>
                              <span className={`text-[9px] ${isDarkMode ? 'text-[#6DA5C0]' : 'text-[#6DA5C0]'}`}>{msg.time}</span>
                            </div>

                            <div className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm break-words ${
                              isMine
                                ? 'bg-gradient-to-r from-[#0C7075] to-[#6DA5C0] text-white rounded-tr-sm'
                                : isDarkMode
                                  ? 'bg-[#072E33] border border-[#294D61] text-[#EAF4F7] rounded-tl-sm'
                                  : 'bg-white border border-[#B9DDE4] text-[#0B3C40] rounded-tl-sm'
                            }`}>
                              {msg.text}
                              {msg.file && (
                                <div className={`mt-2 flex items-center gap-3 p-2.5 rounded-xl border ${isMine ? 'bg-white/10 border-white/20' : (isDarkMode ? 'bg-[#05161A] border-[#294D61]' : 'bg-[#F4FAFC] border-[#B9DDE4]')}`}>
                                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm ${isMine ? 'bg-white/20 text-white' : 'bg-[#D5ECF0] text-[#0C7075]'}`}>
                                    <FileText className="w-4 h-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className={`text-[11px] font-black truncate ${isMine ? 'text-white' : (isDarkMode ? 'text-white' : 'text-[#0B3C40]')}`}>{msg.file.name}</p>
                                    <p className={`text-[10px] ${isMine ? 'text-white/70' : (isDarkMode ? 'text-[#6DA5C0]' : 'text-[#6DA5C0]')}`}>{msg.file.size} <Dot className="w-1 h-1 inline mx-1" /> {msg.file.type}</p>
                                  </div>
                                  {msg.file.url && (
                                    <a
                                      href={msg.file.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`ml-auto shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-bold ${isMine ? 'bg-white/20 text-white' : (isDarkMode ? 'bg-[#0C7075] text-white' : 'bg-[#0C7075] text-white')}`}
                                    >
                                      Open
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ));
              })()}
              <div ref={bottomRef} />
            </div>

            {/* Message Input Bar */}
            <div className={`p-3 sm:p-4 border-t ${isDarkMode ? 'border-[#294D61]' : 'border-[#B9DDE4]'}`}>
              <div className="flex items-center gap-2">
                {/* Paperclip file upload */}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSend(file);
                    e.target.value = '';
                  }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-base border transition-all ${isDarkMode ? 'bg-[#072E33] border-[#294D61] text-white hover:border-[#03F3DA]' : 'bg-[#EAF4F7] border-[#B9DDE4] text-[#0C7075] hover:border-[#0C7075]'}`}
                  title="Attach file"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  placeholder={`Message ${activeContact.name}...`}
                  value={draft}
                  onChange={(e) => {
                    setDraft(e.target.value);
                    const socket = socketRef.current;
                    if (socket?.connected && backendOnline) {
                      socket.emit('typing', activeContactId, user?.name || 'A user');
                    }
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  className={`flex-1 px-4 py-3 rounded-2xl text-xs font-bold border outline-none transition-all ${isDarkMode ? 'bg-[#05161A] border-[#294D61] text-white placeholder:text-[#6DA5C0] focus:border-[#03F3DA]' : 'bg-[#F4FAFC] border-[#B9DDE4] text-[#0B3C40] placeholder:text-[#6DA5C0] focus:border-[#0C7075]'}`}
                />

                <button
                  onClick={() => sendMessage()}
                  className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-r from-[#0C7075] to-[#6DA5C0] text-white font-black flex items-center justify-center text-base shadow-lg hover:scale-105 transition-transform border border-[#03F3DA]/50"
                  title="Send"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
