'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Send, Hash } from 'lucide-react';
import { TEAM_MEMBERS } from '@/data/projectsData';

export interface ProjectChatMessage {
  id: string;
  sender: string;
  avatar: string;
  color: string;
  content: string;
  createdAt: string;
}

interface ProjectChatPanelProps {
  projectId: string;
  projectTitle: string;
}

const storageKey = (id: string) => `omnysync_project_chat_${id}`;

function loadMessages(projectId: string): ProjectChatMessage[] {
  try {
    const raw = localStorage.getItem(storageKey(projectId));
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  const me = TEAM_MEMBERS[0];
  return [
    {
      id: 'seed-1',
      sender: me?.name || 'You',
      avatar: me?.avatar || 'YC',
      color: me?.color || 'bg-[#2dd4bf]',
      content: `Project thread for kickoff — drop blockers, links, and client notes here.`,
      createdAt: new Date().toISOString(),
    },
  ];
}

export default function ProjectChatPanel({ projectId, projectTitle }: ProjectChatPanelProps) {
  const [messages, setMessages] = useState<ProjectChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(loadMessages(projectId));
  }, [projectId]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey(projectId), JSON.stringify(messages));
    } catch {
      /* ignore */
    }
  }, [messages, projectId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!draft.trim()) return;
    const me = TEAM_MEMBERS[0];
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender: me?.name || 'You',
        avatar: me?.avatar || 'YC',
        color: me?.color || 'bg-[#2dd4bf]',
        content: draft.trim(),
        createdAt: new Date().toISOString(),
      },
    ]);
    setDraft('');
  };

  return (
    <div className="flex flex-col h-[420px] rounded-2xl border border-[#1e2a22] bg-[#0b1210] overflow-hidden">
      <div className="px-4 py-3 border-b border-[#1e2a22] flex items-center gap-2 bg-[#141d18]">
        <Hash className="w-4 h-4 text-[#2dd4bf]" />
        <div>
          <p className="text-xs font-bold text-white">#{projectTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 28)}</p>
          <p className="text-[10px] text-[#6b7280]">Per-project ops thread · use Whiteboard tab for sketches</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => (
          <div key={m.id} className="flex items-start gap-2.5">
            <div
              className={`w-7 h-7 rounded-full ${m.color} text-white text-[10px] font-bold flex items-center justify-center shrink-0`}
            >
              {m.avatar}
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-[11px] font-bold text-white">{m.sender}</span>
                <span className="text-[9px] font-mono text-[#6b7280]">
                  {new Date(m.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-[12px] text-[#d1d5db] mt-0.5 whitespace-pre-wrap">{m.content}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={send} className="p-3 border-t border-[#1e2a22] flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Message the project team…"
          className="flex-1 bg-[#141d18] border border-[#1e2a22] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2dd4bf]/40"
        />
        <button
          type="submit"
          className="px-3 py-2 rounded-xl bg-[#2dd4bf] text-[#0a0f0d] font-bold"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
