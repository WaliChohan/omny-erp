'use client';

import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '@/data/chatData';
import MessageBubble from './MessageBubble';

interface MessageFeedProps {
  messages: ChatMessage[];
  emptyLabel?: string;
  isThread?: boolean;
}

// Group messages by date for date dividers
function groupByDate(messages: ChatMessage[]) {
  const groups: { date: string; messages: ChatMessage[] }[] = [];
  for (const msg of messages) {
    const d = new Date(msg.createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    let label: string;
    if (d.toDateString() === today.toDateString()) label = 'Today';
    else if (d.toDateString() === yesterday.toDateString()) label = 'Yesterday';
    else label = d.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

    const last = groups[groups.length - 1];
    if (last && last.date === label) {
      last.messages.push(msg);
    } else {
      groups.push({ date: label, messages: [msg] });
    }
  }
  return groups;
}

export default function MessageFeed({ messages, emptyLabel, isThread = false }: MessageFeedProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  const groups = groupByDate(messages);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#18241d] border border-[#1e2d24] flex items-center justify-center mb-4">
          <span className="text-2xl">💬</span>
        </div>
        <p className="text-sm font-bold text-white mb-1">
          {isThread ? 'No replies yet' : 'No messages yet'}
        </p>
        <p className="text-xs text-[#9ca3af] max-w-xs">
          {emptyLabel ?? 'Be the first to send a message in this channel!'}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto py-2 min-h-0"
    >
      {groups.map((group) => (
        <div key={group.date}>
          {/* Date divider */}
          <div className="flex items-center gap-3 px-4 py-3 sticky top-0 z-10">
            <div className="flex-1 h-px bg-[#1b2620]" />
            <span className="text-[10px] font-bold text-[#6b7280] bg-[#0b0f0d] px-2 rounded-full border border-[#1b2620] whitespace-nowrap">
              {group.date}
            </span>
            <div className="flex-1 h-px bg-[#1b2620]" />
          </div>

          {/* Messages */}
          <div className="space-y-0.5">
            {group.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} compact={isThread} />
            ))}
          </div>
        </div>
      ))}

      <div ref={bottomRef} className="h-2" />
    </div>
  );
}
