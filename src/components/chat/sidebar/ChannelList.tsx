'use client';

import React from 'react';
import { ChatChannel } from '@/data/chatData';
import { useChatStore } from '@/context/ChatContext';
import { Hash, Lock } from 'lucide-react';

interface ChannelListProps {
  channels: ChatChannel[];
}

export default function ChannelList({ channels }: ChannelListProps) {
  const { activeChannelId, setActiveChannelId, unreadCounts } = useChatStore();

  if (channels.length === 0) return null;

  return (
    <div className="space-y-0.5">
      {channels.map((ch) => {
        const isActive = activeChannelId === ch.id;
        const unread = unreadCounts[ch.id] ?? 0;

        return (
          <button
            key={ch.id}
            onClick={() => setActiveChannelId(ch.id)}
            className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all group ${
              isActive
                ? 'bg-[#1b3d2b] text-[#00e676] border border-[#27593e] shadow-sm'
                : 'text-[#9ca3af] hover:text-white hover:bg-[#141e18]'
            }`}
          >
            {/* Icon */}
            <span className={`shrink-0 ${isActive ? 'text-[#00e676]' : 'text-[#6b7280] group-hover:text-[#9ca3af]'}`}>
              {ch.type === 'private' ? (
                <Lock className="w-3 h-3" />
              ) : (
                <Hash className="w-3 h-3" />
              )}
            </span>

            {/* Name */}
            <span className={`flex-1 truncate text-left ${unread > 0 && !isActive ? 'font-bold text-white' : ''}`}>
              {ch.name}
            </span>

            {/* Unread badge */}
            {unread > 0 && !isActive && (
              <span className="ml-auto min-w-[18px] h-4 px-1 bg-[#2dd4bf] text-[#052e24] text-[10px] font-bold rounded-full flex items-center justify-center">
                {unread > 99 ? '99+' : unread}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
