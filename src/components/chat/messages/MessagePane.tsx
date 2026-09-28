'use client';

import React, { useState } from 'react';
import { useChatStore } from '@/context/ChatContext';
import MessageFeed from './MessageFeed';
import MessageComposer from './MessageComposer';
import MessageSearch from './MessageSearch';
import TypingIndicator from '@/components/chat/shared/TypingIndicator';
import UserAvatar from '@/components/chat/shared/UserAvatar';
import {
  Hash,
  Lock,
  Search,
  Pin,
  Users,
  Menu,
} from 'lucide-react';

interface MessagePaneProps {
  onMobileOpenSidebar: () => void;
}

export default function MessagePane({ onMobileOpenSidebar }: MessagePaneProps) {
  const {
    activeChannelId,
    messages,
    typingUsers,
    onlineUserIds,
    getChannelById,
    getUserById,
    getChannelMessages,
    currentUser,
    allUsers,
  } = useChatStore();

  const [showSearch, setShowSearch] = useState(false);
  const [showMembers, setShowMembers] = useState(false);

  const channel = getChannelById(activeChannelId);
  const channelMessages = getChannelMessages(activeChannelId);
  const typingUserIds = typingUsers[activeChannelId] ?? [];
  const typingChatUsers = typingUserIds
    .filter((id) => id !== currentUser.id)
    .map((id) => getUserById(id))
    .filter(Boolean) as ReturnType<typeof getUserById>[];

  const channelMembers = channel
    ? allUsers.filter((u) => channel.members.includes(u.id))
    : [];
  const onlineCount = channelMembers.filter((u) => onlineUserIds.has(u.id)).length;

  if (!channel) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0b0f0d]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#121815] border border-[#1e2d24] flex items-center justify-center mx-auto mb-4">
            <Hash className="w-8 h-8 text-[#4b5563]" />
          </div>
          <p className="text-sm text-[#9ca3af]">Select a channel to start chatting</p>
        </div>
      </div>
    );
  }

  const pinnedMessages = channelMessages.filter((m) => m.isPinned);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#0b0f0d]">
      {/* Channel Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-[#1a2620] bg-[#0d1310] shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile menu toggle */}
          <button
            onClick={onMobileOpenSidebar}
            className="lg:hidden p-1.5 rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#141e18]"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Channel icon */}
          <div className="w-7 h-7 rounded-lg bg-[#1b3d2b] flex items-center justify-center shrink-0">
            {channel.type === 'private' ? (
              <Lock className="w-3.5 h-3.5 text-[#00e676]" />
            ) : channel.type === 'dm' ? (
              (() => {
                const dmUser = channel.dmUserId ? getUserById(channel.dmUserId) : undefined;
                return dmUser ? (
                  <UserAvatar user={dmUser} size="xs" />
                ) : (
                  <Hash className="w-3.5 h-3.5 text-[#00e676]" />
                );
              })()
            ) : (
              <Hash className="w-3.5 h-3.5 text-[#00e676]" />
            )}
          </div>

          {/* Channel name + description */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white truncate">
                {channel.type === 'dm' ? channel.name : `#${channel.name}`}
              </h2>
              {channel.type === 'private' && (
                <span className="text-[10px] bg-[#1b3d2b] text-[#00e676] border border-[#27593e] px-1.5 py-px rounded-full font-semibold shrink-0">
                  Private
                </span>
              )}
            </div>
            {channel.description && (
              <p className="text-[10px] text-[#6b7280] truncate hidden sm:block">
                {channel.description}
              </p>
            )}
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Member count + online status */}
          <button
            onClick={() => setShowMembers((v) => !v)}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              showMembers
                ? 'bg-[#1b3d2b] text-[#00e676] border border-[#27593e]'
                : 'text-[#9ca3af] hover:text-white hover:bg-[#141e18]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{channelMembers.length}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e676]" />
            <span>{onlineCount}</span>
          </button>

          {/* Pinned messages count */}
          {pinnedMessages.length > 0 && (
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] text-[#fbbf24] bg-[#1a1708] border border-[#2d2810]">
              <Pin className="w-3 h-3" />
              <span>{pinnedMessages.length} pinned</span>
            </div>
          )}

          {/* Search */}
          <button
            onClick={() => setShowSearch(true)}
            title="Search messages"
            className="p-2 rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#141e18] transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Members sidebar overlay */}
      {showMembers && (
        <div className="absolute right-0 top-14 w-56 bg-[#121915] border border-[#1e2d24] rounded-xl shadow-2xl z-40 animate-in slide-in-from-top-2 duration-150 overflow-hidden">
          <div className="px-3 py-2 border-b border-[#1b2620]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6b7280]">
              Members — {channelMembers.length}
            </span>
          </div>
          <div className="py-1 max-h-64 overflow-y-auto">
            {channelMembers.map((u) => (
              <div key={u.id} className="flex items-center gap-2.5 px-3 py-2 hover:bg-[#141e18]">
                <UserAvatar
                  user={u}
                  size="sm"
                  showOnline
                  isOnline={onlineUserIds.has(u.id)}
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{u.name}</p>
                  <p className="text-[10px] text-[#6b7280] truncate">{u.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message Feed */}
      <MessageFeed messages={channelMessages} />

      {/* Typing Indicator */}
      <TypingIndicator users={typingChatUsers.filter(Boolean) as NonNullable<typeof typingChatUsers[number]>[]} />

      {/* Composer */}
      <MessageComposer channelId={activeChannelId} />

      {/* Search overlay */}
      {showSearch && <MessageSearch onClose={() => setShowSearch(false)} />}
    </div>
  );
}
