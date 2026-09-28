'use client';

import React, { useMemo } from 'react';
import { CHAT_USERS, ERP_ENTITIES, INITIAL_CHANNELS } from '@/data/chatData';
import { Hash, User, FileText, Briefcase, CheckSquare } from 'lucide-react';

export interface MentionSuggestion {
  type: 'user' | 'channel' | 'invoice' | 'project' | 'task' | 'client';
  id: string;
  label: string;
  sublabel?: string;
}

interface MentionPopoverProps {
  query: string; // text after @
  onSelect: (suggestion: MentionSuggestion) => void;
  onClose: () => void;
}

const TYPE_ICONS: Record<string, React.ElementType> = {
  user: User,
  channel: Hash,
  invoice: FileText,
  client: Briefcase,
  project: Briefcase,
  task: CheckSquare,
};

const TYPE_COLORS: Record<string, string> = {
  user: 'text-[#2dd4bf]',
  channel: 'text-[#9ca3af]',
  invoice: 'text-[#fbbf24]',
  client: 'text-[#a855f7]',
  project: 'text-[#38bdf8]',
  task: 'text-[#b8ff00]',
};

export default function MentionPopover({ query, onSelect, onClose }: MentionPopoverProps) {
  const suggestions = useMemo<MentionSuggestion[]>(() => {
    const q = query.toLowerCase();

    const users: MentionSuggestion[] = CHAT_USERS.map((u) => ({
      type: 'user',
      id: u.id,
      label: u.name,
      sublabel: u.role,
    }));

    const channels: MentionSuggestion[] = INITIAL_CHANNELS
      .filter((c) => c.type !== 'dm')
      .map((c) => ({
        type: 'channel',
        id: c.id,
        label: `#${c.name}`,
        sublabel: c.description,
      }));

    const entities: MentionSuggestion[] = ERP_ENTITIES.map((e) => ({
      type: e.type,
      id: e.id,
      label: e.label,
    }));

    // Special: @channel, @here
    const specials: MentionSuggestion[] = [
      { type: 'channel', id: '@channel', label: '@channel', sublabel: 'Notify all members' },
      { type: 'channel', id: '@here', label: '@here', sublabel: 'Notify online members' },
    ];

    const all = [...specials, ...users, ...channels, ...entities];
    if (!q) return all.slice(0, 8);
    return all
      .filter(
        (s) =>
          s.label.toLowerCase().includes(q) ||
          (s.sublabel?.toLowerCase().includes(q) ?? false)
      )
      .slice(0, 8);
  }, [query]);

  if (suggestions.length === 0) return null;

  return (
    <div className="absolute bottom-full mb-2 left-0 z-50 w-72 bg-[#121915] border border-[#1e2d24] rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-2 duration-150">
      <div className="px-3 py-1.5 border-b border-[#1b2620]">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">
          Mentions & References
        </span>
      </div>
      <div className="py-1 max-h-52 overflow-y-auto">
        {suggestions.map((s) => {
          const Icon = TYPE_ICONS[s.type] ?? User;
          const color = TYPE_COLORS[s.type] ?? 'text-[#9ca3af]';
          return (
            <button
              key={`${s.type}-${s.id}`}
              onClick={() => { onSelect(s); onClose(); }}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#141f19] text-left transition-colors"
            >
              <div className={`w-6 h-6 rounded-lg bg-[#1b2820] flex items-center justify-center shrink-0 ${color}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{s.label}</p>
                {s.sublabel && (
                  <p className="text-[10px] text-[#6b7280] truncate">{s.sublabel}</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
