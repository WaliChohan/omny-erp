'use client';

import React from 'react';
import { ChatUser } from '@/data/chatData';

interface UserAvatarProps {
  user: ChatUser;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showOnline?: boolean;
  isOnline?: boolean;
  className?: string;
}

const SIZE_MAP = {
  xs: { outer: 'w-5 h-5', text: 'text-[9px]', dot: 'w-1.5 h-1.5 border' },
  sm: { outer: 'w-7 h-7', text: 'text-[10px]', dot: 'w-2 h-2 border' },
  md: { outer: 'w-8 h-8', text: 'text-xs',     dot: 'w-2.5 h-2.5 border-[1.5px]' },
  lg: { outer: 'w-10 h-10', text: 'text-sm',   dot: 'w-3 h-3 border-2' },
};

export default function UserAvatar({
  user,
  size = 'md',
  showOnline = false,
  isOnline = false,
  className = '',
}: UserAvatarProps) {
  const s = SIZE_MAP[size];

  return (
    <div className={`relative shrink-0 ${className}`}>
      <div
        className={`${s.outer} rounded-full flex items-center justify-center font-bold ${s.text} text-white select-none`}
        style={{ backgroundColor: user.avatarColor }}
        title={user.name}
      >
        {user.initials}
      </div>

      {showOnline && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 ${s.dot} rounded-full border-[#0b0f0d] ${
            isOnline ? 'bg-[#00e676]' : 'bg-[#4b5563]'
          }`}
        />
      )}
    </div>
  );
}
