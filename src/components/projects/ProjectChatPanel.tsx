'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Send, Hash, Pencil, Trash2, X, Check } from 'lucide-react';
import { TEAM_MEMBERS } from '@/data/projectsData';

export interface ProjectChatMessage {
  id: string;
  sender: string;
  avatar: string;
  color: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const me = TEAM_MEMBERS[0];

  useEffect(() => {
    setMessages(loadMessages(projectId));
    setEditingId(null);
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

  const saveEdit = () => {
    if (!editingId || !editDraft.trim()) return;
    setMessages((prev) =>
      prev.map((m) =>
        m.id === editingId
          ? { ...m, content: editDraft.trim(), updatedAt: new Date().toISOString() }
          : m
      )
    );
    setEditingId(null);
    setEditDraft('');
  };

  const remove = (id: string) => {
    if (!confirm('Delete this message?')) return;
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="flex flex-col h-[460px] rounded-2xl border border-[#1e2a22] bg-[#0b1210] overflow-hidden shadow-lg shadow-black/20">
      <div className="px-4 py-3 border-b border-[#1e2a22] flex items-center gap-2 bg-[#141d18]">
        <Hash className="w-4 h-4 text-[#2dd4bf]" />
        <div>
          <p className="text-xs font-bold text-white">
            #{projectTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 28)}
          </p>
          <p className="text-[10px] text-[#6b7280]">
            Project-local thread (mock) · edit/delete your messages · Whiteboard tab for sketches
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm font-bold text-white">No messages yet</p>
            <p className="text-[11px] text-[#6b7280] mt-1">Say hi to kick off delivery ops.</p>
          </div>
        )}
        {messages.map((m) => {
          const mine = m.sender === (me?.name || 'You');
          return (
            <div key={m.id} className="flex items-start gap-2.5 group">
              <div
                className={`w-7 h-7 rounded-full ${m.color} text-white text-[10px] font-bold flex items-center justify-center shrink-0`}
              >
                {m.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-[11px] font-bold text-white">{m.sender}</span>
                  <span className="text-[9px] font-mono text-[#6b7280]">
                    {new Date(m.createdAt).toLocaleString()}
                    {m.updatedAt ? ' · edited' : ''}
                  </span>
                  {mine && editingId !== m.id && (
                    <span className="opacity-0 group-hover:opacity-100 flex gap-1 ml-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(m.id);
                          setEditDraft(m.content);
                        }}
                        className="text-[#6b7280] hover:text-white"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(m.id)}
                        className="text-[#6b7280] hover:text-[#f87171]"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
                {editingId === m.id ? (
                  <div className="flex gap-2 mt-1">
                    <input
                      value={editDraft}
                      onChange={(e) => setEditDraft(e.target.value)}
                      className="flex-1 bg-[#141d18] border border-[#1e2a22] rounded-lg px-2 py-1 text-xs text-white"
                    />
                    <button type="button" onClick={saveEdit} className="text-[#2dd4bf]">
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="text-[#6b7280]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <p className="text-[12px] text-[#d1d5db] mt-0.5 whitespace-pre-wrap">{m.content}</p>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={send} className="p-3 border-t border-[#1e2a22] flex gap-2 bg-[#0f1512]">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Message the project team…"
          className="flex-1 bg-[#141d18] border border-[#1e2a22] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2dd4bf]/40"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="px-3 py-2 rounded-xl bg-[#2dd4bf] text-[#0a0f0d] font-bold disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
