'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

export type ProjectTabId =
  | 'overview'
  | 'milestones'
  | 'calendar'
  | 'tasks'
  | 'team'
  | 'chat'
  | 'whiteboard'
  | 'docs';

export interface ProjectNavTab {
  id: ProjectTabId;
  label: string;
  icon: LucideIcon;
  badge?: string | number;
}

export interface ProjectNavGroup {
  id: string;
  label: string;
  tabs: ProjectNavTab[];
}

interface ProjectWorkspaceNavProps {
  groups: ProjectNavGroup[];
  activeTab: ProjectTabId;
  onTabChange: (id: ProjectTabId) => void;
}

export default function ProjectWorkspaceNav({
  groups,
  activeTab,
  onTabChange,
}: ProjectWorkspaceNavProps) {
  return (
    <div className="rounded-2xl bg-[#0b1210]/80 border border-[#1e2a22] p-2 space-y-2">
      {groups.map((g) => (
        <div key={g.id} className="flex flex-wrap items-center gap-1.5">
          <span className="text-[9px] font-black uppercase tracking-[0.14em] text-[#4b5563] px-2 min-w-[72px]">
            {g.label}
          </span>
          <div className="flex flex-wrap gap-1">
            {g.tabs.map((t) => {
              const Icon = t.icon;
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onTabChange(t.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                    active
                      ? 'bg-[#2dd4bf] text-[#052e24] shadow-md shadow-[#2dd4bf]/20'
                      : 'bg-[#141d18] text-[#9ca3af] hover:text-white border border-[#1e2a22] hover:border-[#2dd4bf]/30'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {t.label}
                  {t.badge !== undefined && t.badge !== '' && (
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md ${
                        active ? 'bg-black/15' : 'bg-[#0b1210] text-[#6b7280]'
                      }`}
                    >
                      {t.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
