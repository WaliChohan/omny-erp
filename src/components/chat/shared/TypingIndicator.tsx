'use client';

import React from 'react';
import { ChatUser } from '@/data/chatData';

interface TypingIndicatorProps {
  users: ChatUser[];
}

export default function TypingIndicator({ users }: TypingIndicatorProps) {
  if (users.length === 0) return null;

  const label =
    users.length === 1
      ? `${users[0].name} is typing`
      : users.length === 2
      ? `${users[0].name} and ${users[1].name} are typing`
      : `${users[0].name} and ${users.length - 1} others are typing`;

  return (
    <div className="flex items-center gap-2 px-4 py-1.5 text-[11px] text-[#9ca3af]">
      {/* Animated dots */}
      <div className="flex items-center gap-[3px]">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf]"
            style={{
              animation: `chatTypingDot 1.2s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
      <span>{label}…</span>

      <style>{`
        @keyframes chatTypingDot {
          0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-3px); }
        }
      `}</style>
    </div>
  );
}
