'use client';

import React, { useState } from 'react';
import { useChatStore } from '@/context/ChatContext';
import ChannelList from './ChannelList';
import DMList from './DMList';
import UserAvatar from '@/components/chat/shared/UserAvatar';
import { Plus, Search, X, Hash, Lock, MessageSquare, ChevronDown } from 'lucide-react';

interface ChatSidebarProps {
  onMobileClose?: () => void;
}

export default function ChatSidebar({ onMobileClose }: ChatSidebarProps) {
  const {
    channels,
    currentUser,
    onlineUserIds,
    createChannel,
  } = useChatStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChannel, setShowNewChannel] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState<'public' | 'private'>('public');
  const [channelsOpen, setChannelsOpen] = useState(true);
  const [dmsOpen, setDmsOpen] = useState(true);

  const publicChannels = channels.filter((c) => c.type !== 'dm');
  const dmChannels = channels.filter((c) => c.type === 'dm');

  const filteredPublic = searchQuery
    ? publicChannels.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : publicChannels;

  const filteredDMs = searchQuery
    ? dmChannels.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : dmChannels;

  const handleCreateChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    createChannel(newName.trim(), newDesc.trim(), newType);
    setNewName('');
    setNewDesc('');
    setShowNewChannel(false);
  };

  const totalUnread = Object.values(
    Object.fromEntries(
      channels.map((c) => [c.id, 0]) // placeholder, real values from context
    )
  ).reduce((a, b) => a + b, 0);
  void totalUnread;

  return (
    <aside className="w-64 bg-[#0d1310] border-r border-[#1a2620] flex flex-col h-full select-none">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-[#17221c] shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#2dd4bf]/15 border border-[#2dd4bf]/30 flex items-center justify-center text-[#2dd4bf]">
            <MessageSquare className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-bold text-white tracking-tight">Team Chat</span>
        </div>
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="p-1 rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#141e18] lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search */}
      <div className="px-3 pt-3 pb-2 shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-[#6b7280] pointer-events-none" />
          <input
            type="text"
            placeholder="Search channels & DMs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111714] border border-[#1b2620] focus:border-[#2dd4bf] text-white text-[11px] pl-8 pr-3 py-1.5 rounded-lg outline-none placeholder-[#6b7280] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-2 text-[#6b7280] hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable nav */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1 min-h-0">
        {/* Channels Section */}
        <div>
          <div
            onClick={() => setChannelsOpen((v) => !v)}
            className="w-full flex items-center justify-between px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#6b7280] hover:text-white group transition-colors cursor-pointer select-none"
          >
            <span>Channels</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setShowNewChannel(true); }}
                className="p-0.5 rounded hover:bg-[#1a2620] text-[#6b7280] hover:text-[#2dd4bf] transition-colors"
                title="Create channel"
              >
                <Plus className="w-3 h-3" />
              </button>
              <ChevronDown
                className={`w-3 h-3 transition-transform ${channelsOpen ? '' : '-rotate-90'}`}
              />
            </div>
          </div>

          {channelsOpen && <ChannelList channels={filteredPublic} />}
        </div>

        {/* DMs Section */}
        <div className="mt-2">
          <button
            onClick={() => setDmsOpen((v) => !v)}
            className="w-full flex items-center justify-between px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#6b7280] hover:text-white transition-colors"
          >
            <span>Direct Messages</span>
            <ChevronDown
              className={`w-3 h-3 transition-transform ${dmsOpen ? '' : '-rotate-90'}`}
            />
          </button>

          {dmsOpen && <DMList dmChannels={filteredDMs} />}
        </div>
      </div>

      {/* Current User Footer */}
      <div className="shrink-0 px-3 py-2.5 border-t border-[#17221c] bg-[#0c100e]/60">
        <div className="flex items-center gap-2.5">
          <UserAvatar
            user={currentUser}
            size="sm"
            showOnline
            isOnline={onlineUserIds.has(currentUser.id)}
          />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-white truncate">{currentUser.name}</p>
            <p className="text-[10px] text-[#00e676]">● Active</p>
          </div>
        </div>
      </div>

      {/* New Channel Modal */}
      {showNewChannel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#121915] border border-[#1e2d24] w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-[#1b2820]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Hash className="w-4 h-4 text-[#2dd4bf]" />
                Create New Channel
              </h3>
              <button
                onClick={() => setShowNewChannel(false)}
                className="p-1 rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#1a2620]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateChannel} className="p-4 space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#9ca3af] mb-1">
                  Channel Name *
                </label>
                <input
                  autoFocus
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. marketing, q4-planning"
                  className="w-full bg-[#16211a] border border-[#22352a] focus:border-[#2dd4bf] text-white text-xs px-3 py-2 rounded-lg outline-none placeholder-[#6b7280]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#9ca3af] mb-1">
                  Description
                </label>
                <input
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="What's this channel about?"
                  className="w-full bg-[#16211a] border border-[#22352a] focus:border-[#2dd4bf] text-white text-xs px-3 py-2 rounded-lg outline-none placeholder-[#6b7280]"
                />
              </div>

              {/* Type toggle */}
              <div>
                <label className="block text-[11px] font-semibold text-[#9ca3af] mb-2">
                  Channel Type
                </label>
                <div className="flex gap-2">
                  {(['public', 'private'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewType(t)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold border transition-all ${
                        newType === t
                          ? 'bg-[#1b3d2b] text-[#00e676] border-[#27593e]'
                          : 'bg-[#141e18] text-[#9ca3af] border-[#1e2d24] hover:text-white'
                      }`}
                    >
                      {t === 'private' ? <Lock className="w-3 h-3" /> : <Hash className="w-3 h-3" />}
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowNewChannel(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#9ca3af] hover:text-white hover:bg-[#1a2620]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#2dd4bf] hover:bg-[#26b8a5] text-[#052e24] font-bold text-xs shadow-md shadow-[#2dd4bf]/20"
                >
                  Create Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
}
