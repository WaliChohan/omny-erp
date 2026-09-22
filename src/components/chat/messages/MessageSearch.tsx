'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useChatStore } from '@/context/ChatContext';
import UserAvatar from '@/components/chat/shared/UserAvatar';
import { Search, X, Hash, MessageSquare, Clock } from 'lucide-react';

interface MessageSearchProps {
  onClose: () => void;
}

export default function MessageSearch({ onClose }: MessageSearchProps) {
  const { messages, channels, getUserById, setActiveChannelId, getChannelById } = useChatStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return messages
      .filter(
        (m) =>
          m.content.toLowerCase().includes(q) ||
          getUserById(m.senderId)?.name.toLowerCase().includes(q) ||
          getChannelById(m.channelId)?.name.toLowerCase().includes(q)
      )
      .slice(0, 30);
  }, [query, messages, getUserById, getChannelById]);

  const handleResultClick = (channelId: string) => {
    setActiveChannelId(channelId);
    onClose();
  };

  const timeStr = (iso: string) =>
    new Date(iso).toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#121915] border border-[#1e2d24] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1b2620]">
          <Search className="w-4 h-4 text-[#6b7280] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search messages, channels, people…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder-[#6b7280] outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#1a2620] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[480px] overflow-y-auto">
          {query.trim() === '' ? (
            <div className="py-10 text-center">
              <Search className="w-8 h-8 text-[#4b5563] mx-auto mb-3" />
              <p className="text-sm text-[#9ca3af]">Type to search across all channels</p>
              <p className="text-xs text-[#6b7280] mt-1">Messages, people, channels, and files</p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-10 text-center">
              <MessageSquare className="w-8 h-8 text-[#4b5563] mx-auto mb-3" />
              <p className="text-sm text-[#9ca3af]">No results for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-[#6b7280] mt-1">Try different keywords</p>
            </div>
          ) : (
            <div className="py-2">
              <div className="px-4 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">
                {results.length} result{results.length !== 1 ? 's' : ''}
              </div>
              {results.map((msg) => {
                const sender = getUserById(msg.senderId);
                const channel = getChannelById(msg.channelId);
                if (!sender) return null;

                return (
                  <button
                    key={msg.id}
                    onClick={() => handleResultClick(msg.channelId)}
                    className="w-full flex items-start gap-3 px-4 py-3 hover:bg-[#141e18] text-left transition-colors group"
                  >
                    <UserAvatar user={sender} size="sm" className="mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-xs font-bold text-white">{sender.name}</span>
                        {channel && (
                          <span className="flex items-center gap-0.5 text-[10px] text-[#6b7280]">
                            <Hash className="w-2.5 h-2.5" />
                            {channel.name}
                          </span>
                        )}
                        <span className="flex items-center gap-0.5 text-[10px] text-[#6b7280] ml-auto">
                          <Clock className="w-2.5 h-2.5" />
                          {timeStr(msg.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-[#9ca3af] line-clamp-2 group-hover:text-[#e5e7eb] transition-colors">
                        {msg.content.slice(0, 200)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2 border-t border-[#1b2620] flex items-center gap-4 text-[10px] text-[#6b7280]">
          <span><kbd className="bg-[#1a2620] px-1.5 py-0.5 rounded text-[#9ca3af] border border-[#273d2f]">Esc</kbd> to close</span>
          <span><kbd className="bg-[#1a2620] px-1.5 py-0.5 rounded text-[#9ca3af] border border-[#273d2f]">Enter</kbd> to navigate</span>
        </div>
      </div>
    </div>
  );
}
