'use client';

import React, { useState } from 'react';
import { useWhiteboard } from '@/context/WhiteboardContext';
import { useChatStore } from '@/context/ChatContext';
import {
  LayoutDashboard,
  BarChart2,
  Landmark,
  Briefcase,
  FileText,
  Search,
  Bell,
  Sparkles,
  Share2,
  X,
  Users2,
  PenTool,
  CheckSquare,
  ShieldCheck,
  MessageSquare,
  Building2,
} from 'lucide-react';

export type OmnysyncNavTab =
  | 'dashboard'
  | 'analytics'
  | 'finance'
  | 'projects'
  | 'clients'
  | 'crm'
  | 'todo'
  | 'portal'
  | 'chat'
  | 'documents'
  | 'tabular'
  | 'drive'
  | 'calendar';

interface OmnysyncTopNavProps {
  activeTab: OmnysyncNavTab;
  onTabChange: (tab: OmnysyncNavTab) => void;
  onOpenAskAI: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function OmnysyncTopNav({
  activeTab,
  onTabChange,
  onOpenAskAI,
  searchQuery,
  onSearchChange,
}: OmnysyncTopNavProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const { openWhiteboard } = useWhiteboard();
  const { unreadCounts, channels } = useChatStore();
  const totalChatUnread = channels.reduce((sum, ch) => sum + (unreadCounts[ch.id] ?? 0), 0);

  const tabs: { id: OmnysyncNavTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'crm', label: 'CRM', icon: Users2 },
    { id: 'clients', label: 'Clients', icon: Building2 },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'finance', label: 'Finance', icon: Landmark },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'portal', label: 'Portal', icon: ShieldCheck },
    { id: 'todo', label: 'Tasks', icon: CheckSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
  ];

  const notifications = [
    {
      title: 'Quote approved — CoolAir Pros',
      detail: 'HVAC booking portal · PKR 1.2M',
      tone: 'text-[#2dd4bf]',
    },
    {
      title: 'Invoice INV-1042 paid',
      detail: 'HomeServe Partners · milestone 1',
      tone: 'text-[#9ca3af]',
    },
    {
      title: 'SEO report due tomorrow',
      detail: 'Apex Plumbing monthly retainer',
      tone: 'text-[#f59e0b]',
    },
  ];

  return (
    <nav className="h-16 bg-[#0a0f0d] border-b border-[#18261f] px-4 md:px-6 flex items-center justify-between gap-3 sticky top-0 z-40 select-none">
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onTabChange('dashboard')}>
          <div className="w-8 h-8 rounded-lg bg-[#2dd4bf]/20 border border-[#2dd4bf]/40 flex items-center justify-center text-[#2dd4bf] shadow-sm shadow-[#2dd4bf]/20">
            <Share2 className="w-4 h-4 text-[#2dd4bf] transform rotate-90" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-black tracking-wider text-white">OMNYSYNC</span>
            <span className="text-[9px] text-[#6b7280] hidden sm:block">Agency Command</span>
          </div>
        </div>
      </div>

      <div className="hidden xl:flex items-center gap-1 bg-[#121915] p-1 rounded-xl border border-[#1d2a23] overflow-x-auto max-w-[720px]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id || (tab.id === 'projects' && (activeTab === 'drive' || activeTab === 'calendar'));
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-150 whitespace-nowrap ${
                isActive
                  ? 'bg-[#2dd4bf] text-[#052e24] shadow-md shadow-[#2dd4bf]/25'
                  : 'text-[#9ca3af] hover:text-white hover:bg-[#19241e]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#052e24]' : 'text-[#6b7280]'}`} />
              <span>{tab.label}</span>
              {tab.id === 'chat' && totalChatUnread > 0 && !isActive && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-[#f43f5e] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalChatUnread > 99 ? '99+' : totalChatUnread}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="xl:hidden flex items-center">
        <select
          value={activeTab === 'drive' || activeTab === 'calendar' || activeTab === 'tabular' ? 'projects' : activeTab}
          onChange={(e) => onTabChange(e.target.value as OmnysyncNavTab)}
          className="bg-[#141d18] border border-[#223328] text-white text-xs rounded-lg px-2.5 py-1.5 outline-none"
        >
          {tabs.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onOpenAskAI}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1e2538] hover:bg-[#28324d] border border-[#3b4b73] text-xs font-semibold text-[#a5b4fc] transition-all hover:scale-105"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#818cf8]" />
          <span>Ask AI</span>
        </button>
        <button
          onClick={openWhiteboard}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1e2538] hover:bg-[#28324d] border border-[#3b4b73] text-xs font-semibold text-[#a5b4fc] transition-all hover:scale-105"
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>Whiteboard</span>
        </button>

        <div className="relative flex items-center">
          {showSearchInput ? (
            <div className="relative flex items-center animate-in fade-in">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search clients, projects, invoices..."
                className="w-48 sm:w-64 bg-[#141d18] border border-[#274032] focus:border-[#2dd4bf] text-white text-xs pl-8 pr-7 py-1.5 rounded-lg outline-none"
              />
              <Search className="w-3.5 h-3.5 text-[#6b7280] absolute left-2.5 pointer-events-none" />
              <button
                onClick={() => {
                  setShowSearchInput(false);
                  onSearchChange('');
                }}
                className="absolute right-2 text-[#6b7280] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSearchInput(true)}
              aria-label="Search"
              className="w-8 h-8 rounded-lg bg-[#141d18] border border-[#1e2d24] flex items-center justify-center text-[#9ca3af] hover:text-white hover:bg-[#1a2620] transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            className="relative w-8 h-8 rounded-lg bg-[#141d18] border border-[#1e2d24] flex items-center justify-center text-[#9ca3af] hover:text-white hover:bg-[#1a2620] transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#ef4444] text-[9px] font-bold text-white flex items-center justify-center">
              {notifications.length}
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#121915] border border-[#1e2d24] rounded-xl shadow-2xl p-3 z-50 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-[#1a2620]">
                <span className="text-xs font-bold text-white">Agency Alerts</span>
                <span className="text-[10px] bg-[#2dd4bf]/20 text-[#2dd4bf] px-1.5 py-0.5 rounded font-semibold">
                  {notifications.length} Active
                </span>
              </div>
              <div className="py-2 space-y-2 text-xs">
                {notifications.map((n) => (
                  <div key={n.title} className="p-1.5 rounded hover:bg-[#19241e] cursor-pointer">
                    <p className="font-semibold text-white">{n.title}</p>
                    <p className={`text-[11px] ${n.tone}`}>{n.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div
          onClick={() => onTabChange('clients')}
          className="flex items-center gap-2 pl-1 cursor-pointer group"
          title="OMNYSYNC Agency"
        >
          <div className="w-8 h-8 rounded-full bg-[#d97706] text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-transparent group-hover:ring-[#2dd4bf] transition-all">
            OS
          </div>
        </div>
      </div>
    </nav>
  );
}
