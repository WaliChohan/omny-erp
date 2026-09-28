'use client';

import React, { useState } from 'react';
import ChatSidebar from './sidebar/ChatSidebar';
import MessagePane from './messages/MessagePane';
import ThreadPanel from './messages/ThreadPanel';
import { useChatStore } from '@/context/ChatContext';

export default function ChatView() {
  const { threadMessageId } = useChatStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[#0b0f0d] relative">
      {/* Mobile sidebar backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Left: Chat Sidebar */}
      <div
        className={`
          shrink-0 h-full
          fixed lg:relative z-40 lg:z-auto
          transition-transform duration-200
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <ChatSidebar onMobileClose={() => setMobileSidebarOpen(false)} />
      </div>

      {/* Center: Message Pane */}
      <MessagePane onMobileOpenSidebar={() => setMobileSidebarOpen(true)} />

      {/* Right: Thread Panel (conditionally shown) */}
      {threadMessageId && (
        <div className="shrink-0 h-full hidden md:block">
          <ThreadPanel />
        </div>
      )}
    </div>
  );
}
