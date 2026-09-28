'use client';

import React from 'react';
import {
  Zap,
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  FileText,
  Settings,
  ChevronRight,
  CheckSquare,
  ShieldCheck,
  MessageSquare,
  Briefcase,
  Building2,
} from 'lucide-react';

interface SidebarProps {
  currentNav: string;
  onNavSelect: (id: string) => void;
  onOpenQuickAction?: (actionType: string) => void;
}

export default function Sidebar({ currentNav, onNavSelect }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'crm', label: 'CRM & Pipeline', icon: Users },
    { id: 'clients', label: 'Clients', icon: Building2 },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'finance', label: 'Finance', icon: CreditCard },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'portal', label: 'Client Portal', icon: ShieldCheck },
    { id: 'todo', label: 'Tasks', icon: CheckSquare },
    { id: 'chat', label: 'Team Chat', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0d1310] border-r border-[#1a2620] flex flex-col shrink-0 min-h-screen select-none">
      <div className="h-16 flex items-center px-6 gap-2.5 border-b border-[#17221c]">
        <div className="w-8 h-8 rounded-lg bg-[#00e676] flex items-center justify-center text-black font-black shadow-md shadow-[#00e676]/20">
          <Zap className="w-5 h-5 fill-black text-black" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-black text-white tracking-wide">OMNYSYNC</span>
          <span className="text-[10px] text-[#6b7280] font-medium">Agency ERP</span>
        </div>
      </div>

      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <p className="px-3.5 pb-2 text-[10px] uppercase tracking-wider text-[#4b5563] font-semibold">
          Workspace
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavSelect(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-[#1b3d2b] text-[#00e676] border border-[#27593e] shadow-sm'
                  : 'text-[#9ca3af] hover:text-white hover:bg-[#141e18]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-[#00e676]' : 'text-[#6b7280] group-hover:text-white'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.id !== 'dashboard' && (
                <ChevronRight className="w-3.5 h-3.5 text-[#4b5563] group-hover:text-[#9ca3af] transition-transform group-hover:translate-x-0.5" />
              )}
            </button>
          );
        })}
      </div>

      <div className="p-3 border-t border-[#17221c]">
        <div className="rounded-xl bg-[#141e18] border border-[#223328] p-3">
          <p className="text-[10px] font-bold text-[#2dd4bf] uppercase tracking-wider">Focus</p>
          <p className="text-[11px] text-[#9ca3af] mt-1 leading-relaxed">
            Websites · Custom software · SEO · Apps for HVAC & home services.
          </p>
        </div>
      </div>
    </aside>
  );
}
