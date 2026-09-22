'use client';

import React from 'react';
import { useChatStore } from '@/context/ChatContext';
import MessageFeed from './MessageFeed';
import MessageComposer from './MessageComposer';
import MessageBubble from './MessageBubble';
import { X, MessageSquare } from 'lucide-react';

export default function ThreadPanel() {
  const {
    threadMessageId,
    setThreadMessageId,
    getThreadMessages,
    messages,
  } = useChatStore();

  if (!threadMessageId) return null;

  const parentMessage = messages.find((m) => m.id === threadMessageId);
  const threadMessages = getThreadMessages(threadMessageId);

  return (
    <div className="w-80 bg-[#0d1310] border-l border-[#1a2620] flex flex-col h-full animate-in slide-in-from-right duration-200">
      {/* Thread Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-[#17221c] shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#2dd4bf]" />
          <span className="text-sm font-bold text-white">Thread</span>
          {threadMessages.length > 0 && (
            <span className="text-[10px] bg-[#2dd4bf]/20 text-[#2dd4bf] border border-[#2dd4bf]/30 px-1.5 py-0.5 rounded-full font-bold">
              {threadMessages.length} {threadMessages.length === 1 ? 'reply' : 'replies'}
            </span>
          )}
        </div>
        <button
          onClick={() => setThreadMessageId(null)}
          className="p-1.5 rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#141e18] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Parent message */}
      {parentMessage && (
        <div className="border-b border-[#1b2620] py-2 bg-[#0f1612]/50">
          <div className="px-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280] px-2 pb-1">
              Original Message
            </div>
            <MessageBubble message={parentMessage} isThreadParent compact />
          </div>
        </div>
      )}

      {/* Thread replies */}
      <div className="flex flex-col flex-1 min-h-0">
        <MessageFeed
          messages={threadMessages}
          emptyLabel="No replies yet. Start the thread below!"
          isThread
        />

        {/* Composer for thread replies */}
        <div className="pt-2">
          <MessageComposer
            channelId={parentMessage?.channelId ?? ''}
            threadOf={threadMessageId}
            placeholder="Reply in thread…"
          />
        </div>
      </div>
    </div>
  );
}
