'use client';

import React, { useState, useRef, useEffect } from 'react';
import { EMOJI_SET } from '@/data/chatData';
import { Search } from 'lucide-react';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
  anchorRef?: React.RefObject<HTMLElement | null>;
}

export default function EmojiPicker({ onSelect, onClose, anchorRef }: EmojiPickerProps) {
  const [query, setQuery] = useState('');
  const pickerRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? EMOJI_SET.filter((e) => e.includes(query))
    : EMOJI_SET;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target as Node) &&
        !anchorRef?.current?.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose, anchorRef]);

  return (
    <div
      ref={pickerRef}
      className="absolute bottom-full mb-2 left-0 z-50 w-56 bg-[#121915] border border-[#1e2d24] rounded-xl shadow-2xl p-2 animate-in zoom-in-95 duration-150"
    >
      {/* Search */}
      <div className="relative mb-2">
        <Search className="absolute left-2.5 top-2 w-3 h-3 text-[#6b7280] pointer-events-none" />
        <input
          autoFocus
          type="text"
          placeholder="Search emoji..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-[#0f1612] border border-[#1b2620] text-white text-[11px] pl-7 pr-3 py-1.5 rounded-lg outline-none placeholder-[#6b7280]"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-8 gap-0.5 max-h-36 overflow-y-auto">
        {filtered.map((emoji) => (
          <button
            key={emoji}
            onClick={() => { onSelect(emoji); onClose(); }}
            className="p-1 text-base rounded hover:bg-[#1a2620] transition-colors leading-none"
            title={emoji}
          >
            {emoji}
          </button>
        ))}
        {filtered.length === 0 && (
          <span className="col-span-8 text-center text-[11px] text-[#6b7280] py-3">
            No emoji found
          </span>
        )}
      </div>
    </div>
  );
}
