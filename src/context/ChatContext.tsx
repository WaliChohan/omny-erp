'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from 'react';
import {
  ChatChannel,
  ChatMessage,
  MessageReaction,
  ChatBroadcastEvent,
  INITIAL_CHANNELS,
  SEED_MESSAGES,
  CURRENT_USER,
  CHAT_USERS,
  ChatUser,
} from '@/data/chatData';

// ── Storage Keys ─────────────────────────────────────────────────────────────

const STORAGE_CHANNELS = 'omnysync_chat_channels';
const STORAGE_MESSAGES = 'omnysync_chat_messages';
const BROADCAST_CHANNEL = 'omnysync_chat';

// ── Context Shape ─────────────────────────────────────────────────────────────

interface ChatContextValue {
  // State
  channels: ChatChannel[];
  messages: ChatMessage[];
  activeChannelId: string;
  threadMessageId: string | null;
  typingUsers: Record<string, string[]>; // channelId -> userId[]
  onlineUserIds: Set<string>;
  currentUser: ChatUser;
  allUsers: ChatUser[];
  unreadCounts: Record<string, number>; // channelId -> count

  // Actions
  setActiveChannelId: (id: string) => void;
  setThreadMessageId: (id: string | null) => void;
  sendMessage: (channelId: string, content: string, threadOf?: string) => void;
  editMessage: (messageId: string, content: string) => void;
  deleteMessage: (messageId: string) => void;
  toggleReaction: (messageId: string, emoji: string) => void;
  pinMessage: (messageId: string, isPinned: boolean) => void;
  setTyping: (channelId: string, isTyping: boolean) => void;
  markChannelRead: (channelId: string) => void;
  createChannel: (name: string, description: string, type: 'public' | 'private') => void;

  // Helpers
  getChannelMessages: (channelId: string, parentOnly?: boolean) => ChatMessage[];
  getThreadMessages: (parentMessageId: string) => ChatMessage[];
  getUserById: (id: string) => ChatUser | undefined;
  getChannelById: (id: string) => ChatChannel | undefined;
}

// ── Context Creation ──────────────────────────────────────────────────────────

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

// ── Provider ──────────────────────────────────────────────────────────────────

export function ChatProvider({ children }: { children: ReactNode }) {
  const [channels, setChannels] = useState<ChatChannel[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeChannelId, setActiveChannelIdRaw] = useState('ch-general');
  const [threadMessageId, setThreadMessageId] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({});
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const typingTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const broadcastRef = useRef<BroadcastChannel | null>(null);

  // Simulated online users (in a real app this comes from presence)
  const onlineUserIds = new Set(['user-wali', 'user-ahmed', 'user-sarah', 'user-zara']);

  // ── Initialize from localStorage ─────────────────────────────────────────

  useEffect(() => {
    try {
      const savedChannels = localStorage.getItem(STORAGE_CHANNELS);
      const savedMessages = localStorage.getItem(STORAGE_MESSAGES);

      setChannels(savedChannels ? JSON.parse(savedChannels) : INITIAL_CHANNELS);
      setMessages(savedMessages ? JSON.parse(savedMessages) : SEED_MESSAGES);
    } catch {
      setChannels(INITIAL_CHANNELS);
      setMessages(SEED_MESSAGES);
    }
  }, []);

  // ── BroadcastChannel for cross-tab sync ───────────────────────────────────

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const bc = new BroadcastChannel(BROADCAST_CHANNEL);
    broadcastRef.current = bc;

    bc.onmessage = (event: MessageEvent<ChatBroadcastEvent>) => {
      const evt = event.data;
      switch (evt.type) {
        case 'NEW_MESSAGE':
          setMessages((prev) => {
            if (prev.some((m) => m.id === evt.message.id)) return prev;
            const next = [...prev, evt.message];
            try { localStorage.setItem(STORAGE_MESSAGES, JSON.stringify(next)); } catch {}
            return next;
          });
          // Increment unread if not the active channel
          setUnreadCounts((prev) => {
            const chId = evt.message.channelId;
            if (chId === activeChannelId) return prev;
            return { ...prev, [chId]: (prev[chId] ?? 0) + 1 };
          });
          break;

        case 'REACTION_UPDATE':
          setMessages((prev) =>
            prev.map((m) =>
              m.id === evt.messageId ? { ...m, reactions: evt.reactions } : m
            )
          );
          break;

        case 'TYPING':
          setTypingUsers((prev) => {
            const current = prev[evt.channelId] ?? [];
            if (evt.isTyping) {
              return { ...prev, [evt.channelId]: Array.from(new Set([...current, evt.userId])) };
            } else {
              return { ...prev, [evt.channelId]: current.filter((id) => id !== evt.userId) };
            }
          });
          break;

        case 'PIN_MESSAGE':
          setMessages((prev) =>
            prev.map((m) =>
              m.id === evt.messageId ? { ...m, isPinned: evt.isPinned } : m
            )
          );
          break;

        case 'EDIT_MESSAGE':
          setMessages((prev) =>
            prev.map((m) =>
              m.id === evt.messageId
                ? { ...m, content: evt.content, isEdited: true, updatedAt: new Date().toISOString() }
                : m
            )
          );
          break;

        case 'DELETE_MESSAGE':
          setMessages((prev) => prev.filter((m) => m.id !== evt.messageId));
          break;
      }
    };

    return () => { bc.close(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChannelId]);

  // ── Persist helpers ───────────────────────────────────────────────────────

  const persistMessages = useCallback((msgs: ChatMessage[]) => {
    setMessages(msgs);
    try { localStorage.setItem(STORAGE_MESSAGES, JSON.stringify(msgs)); } catch {}
  }, []);

  const persistChannels = useCallback((chs: ChatChannel[]) => {
    setChannels(chs);
    try { localStorage.setItem(STORAGE_CHANNELS, JSON.stringify(chs)); } catch {}
  }, []);

  // ── Broadcast helper ──────────────────────────────────────────────────────

  const broadcast = useCallback((evt: ChatBroadcastEvent) => {
    broadcastRef.current?.postMessage(evt);
  }, []);

  // ── Actions ───────────────────────────────────────────────────────────────

  const setActiveChannelId = useCallback((id: string) => {
    setActiveChannelIdRaw(id);
    setThreadMessageId(null);
    setUnreadCounts((prev) => ({ ...prev, [id]: 0 }));
  }, []);

  const sendMessage = useCallback(
    (channelId: string, content: string, threadOf?: string) => {
      const newMessage: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        channelId,
        senderId: CURRENT_USER.id,
        content: content.trim(),
        threadOf,
        threadCount: 0,
        isPinned: false,
        isEdited: false,
        reactions: [],
        attachments: [],
        erpMentions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setMessages((prev) => {
        let next = [...prev, newMessage];
        // Update parent's threadCount if this is a reply
        if (threadOf) {
          next = next.map((m) =>
            m.id === threadOf
              ? { ...m, threadCount: (m.threadCount ?? 0) + 1 }
              : m
          );
        }
        try { localStorage.setItem(STORAGE_MESSAGES, JSON.stringify(next)); } catch {}
        return next;
      });

      broadcast({ type: 'NEW_MESSAGE', message: newMessage });
    },
    [broadcast]
  );

  const editMessage = useCallback(
    (messageId: string, content: string) => {
      setMessages((prev) => {
        const next = prev.map((m) =>
          m.id === messageId
            ? { ...m, content, isEdited: true, updatedAt: new Date().toISOString() }
            : m
        );
        try { localStorage.setItem(STORAGE_MESSAGES, JSON.stringify(next)); } catch {}
        return next;
      });
      broadcast({ type: 'EDIT_MESSAGE', messageId, content });
    },
    [broadcast]
  );

  const deleteMessage = useCallback(
    (messageId: string) => {
      setMessages((prev) => {
        const next = prev.filter((m) => m.id !== messageId);
        try { localStorage.setItem(STORAGE_MESSAGES, JSON.stringify(next)); } catch {}
        return next;
      });
      broadcast({ type: 'DELETE_MESSAGE', messageId });
    },
    [broadcast]
  );

  const toggleReaction = useCallback(
    (messageId: string, emoji: string) => {
      setMessages((prev) => {
        const next = prev.map((m) => {
          if (m.id !== messageId) return m;
          const existing = m.reactions.find((r) => r.emoji === emoji);
          let newReactions: MessageReaction[];
          if (existing) {
            const hasMyReaction = existing.userIds.includes(CURRENT_USER.id);
            newReactions = hasMyReaction
              ? m.reactions
                  .map((r) =>
                    r.emoji === emoji
                      ? { ...r, userIds: r.userIds.filter((id) => id !== CURRENT_USER.id) }
                      : r
                  )
                  .filter((r) => r.userIds.length > 0)
              : m.reactions.map((r) =>
                  r.emoji === emoji
                    ? { ...r, userIds: [...r.userIds, CURRENT_USER.id] }
                    : r
                );
          } else {
            newReactions = [...m.reactions, { emoji, userIds: [CURRENT_USER.id] }];
          }
          broadcast({ type: 'REACTION_UPDATE', messageId, reactions: newReactions });
          return { ...m, reactions: newReactions };
        });
        try { localStorage.setItem(STORAGE_MESSAGES, JSON.stringify(next)); } catch {}
        return next;
      });
    },
    [broadcast]
  );

  const pinMessage = useCallback(
    (messageId: string, isPinned: boolean) => {
      setMessages((prev) => {
        const next = prev.map((m) => (m.id === messageId ? { ...m, isPinned } : m));
        try { localStorage.setItem(STORAGE_MESSAGES, JSON.stringify(next)); } catch {}
        return next;
      });
      broadcast({ type: 'PIN_MESSAGE', messageId, isPinned });
    },
    [broadcast]
  );

  const setTyping = useCallback(
    (channelId: string, isTyping: boolean) => {
      const timerKey = `${channelId}-${CURRENT_USER.id}`;
      if (typingTimers.current[timerKey]) {
        clearTimeout(typingTimers.current[timerKey]);
      }
      broadcast({ type: 'TYPING', channelId, userId: CURRENT_USER.id, isTyping });
      if (isTyping) {
        typingTimers.current[timerKey] = setTimeout(() => {
          broadcast({ type: 'TYPING', channelId, userId: CURRENT_USER.id, isTyping: false });
        }, 3000);
      }
    },
    [broadcast]
  );

  const markChannelRead = useCallback((channelId: string) => {
    setUnreadCounts((prev) => ({ ...prev, [channelId]: 0 }));
  }, []);

  const createChannel = useCallback(
    (name: string, description: string, type: 'public' | 'private') => {
      const newChannel: ChatChannel = {
        id: `ch-${Date.now()}`,
        name: name.toLowerCase().replace(/\s+/g, '-'),
        description,
        type,
        members: [CURRENT_USER.id],
        createdBy: CURRENT_USER.id,
        createdAt: new Date().toISOString(),
        isArchived: false,
      };
      persistChannels([...channels, newChannel]);
      setActiveChannelId(newChannel.id);
    },
    [channels, persistChannels, setActiveChannelId]
  );

  // ── Helpers ───────────────────────────────────────────────────────────────

  const getChannelMessages = useCallback(
    (channelId: string, parentOnly = false) => {
      return messages.filter(
        (m) =>
          m.channelId === channelId &&
          (parentOnly ? !m.threadOf : !m.threadOf)
      );
    },
    [messages]
  );

  const getThreadMessages = useCallback(
    (parentMessageId: string) => {
      return messages.filter((m) => m.threadOf === parentMessageId);
    },
    [messages]
  );

  const getUserById = useCallback(
    (id: string) => CHAT_USERS.find((u) => u.id === id),
    []
  );

  const getChannelById = useCallback(
    (id: string) => channels.find((c) => c.id === id),
    [channels]
  );

  // Suppress unused warning for persistMessages (it's used indirectly)
  void persistMessages;

  return (
    <ChatContext.Provider
      value={{
        channels,
        messages,
        activeChannelId,
        threadMessageId,
        typingUsers,
        onlineUserIds,
        currentUser: CURRENT_USER,
        allUsers: CHAT_USERS,
        unreadCounts,
        setActiveChannelId,
        setThreadMessageId,
        sendMessage,
        editMessage,
        deleteMessage,
        toggleReaction,
        pinMessage,
        setTyping,
        markChannelRead,
        createChannel,
        getChannelMessages,
        getThreadMessages,
        getUserById,
        getChannelById,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useChatStore(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatStore must be used within a ChatProvider');
  return ctx;
}
