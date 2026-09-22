'use client';

import React from 'react';
import { ChatChannel } from '@/data/chatData';
import { useChatStore } from '@/context/ChatContext';
import UserAvatar from '@/components/chat/shared/UserAvatar';

interface DMListProps {
  dmChannels: ChatChannel[];
}

export default function DMList({ dmChannels }: DMListProps) {
  const { activeChannelId, setActiveChannelId, unreadCounts, onlineUserIds, getUserById } = useChatStore();

  if (dmChannels.length === 0) return null;

  return (
    <div className="space-y-0.5">
      {dmChannels.map((ch) => {
        const isActive = activeChannelId === ch.id;
        const unread = unreadCounts[ch.id] ?? 0;
        const dmUser = ch.dmUserId ? getUserById(ch.dmUserId) : undefined;
        const isOnline = dmUser ? onlineUserIds.has(dmUser.id) : false;

        return (
          <button
            key={ch.id}
            onClick={() => setActiveChannelId(ch.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all group ${
              isActive
                ? 'bg-[#1b3d2b] text-[#00e676] border border-[#27593e] shadow-sm'
                : 'text-[#9ca3af] hover:text-white hover:bg-[#141e18]'
            }`}
          >
            {dmUser ? (
              <UserAvatar
                user={dmUser}
                size="xs"
                showOnline
                isOnline={isOnline}
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-[#2a2a2a] shrink-0" />
            )}

            <span className={`flex-1 truncate text-left ${unread > 0 && !isActive ? 'font-bold text-white' : ''}`}>
              {ch.name}
            </span>

            {/* Online dot when no unread */}
            {unread === 0 && isOnline && !isActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e676] shrink-0" />
            )}

            {/* Unread badge */}
            {unread > 0 && !isActive && (
              <span className="min-w-[18px] h-4 px-1 bg-[#2dd4bf] text-[#052e24] text-[10px] font-bold rounded-full flex items-center justify-center">
                {unread > 99 ? '99+' : unread}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
