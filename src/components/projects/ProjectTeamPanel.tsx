'use client';

import React, { useState } from 'react';
import { TeamMember, TEAM_MEMBERS } from '@/data/projectsData';
import { Plus, Trash2, Users } from 'lucide-react';

interface ProjectTeamPanelProps {
  team: TeamMember[];
  onChange: (next: TeamMember[]) => void;
  taskCounts?: Record<string, number>;
}

export default function ProjectTeamPanel({ team, onChange, taskCounts = {} }: ProjectTeamPanelProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const available = TEAM_MEMBERS.filter((m) => !team.some((t) => t.id === m.id));

  const add = (m: TeamMember) => {
    onChange([...team, m]);
    setPickerOpen(false);
  };

  const remove = (id: string) => {
    if (!confirm('Remove this member from the project roster?')) return;
    onChange(team.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#121915] border border-[#1e2d24] p-5">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-4 h-4 text-[#38bdf8]" /> Project roster
          </h2>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            People who can be assigned on this project&apos;s tasks
          </p>
        </div>
        <button
          type="button"
          onClick={() => setPickerOpen((v) => !v)}
          className="px-4 py-2 rounded-xl bg-[#2dd4bf] text-[#052e24] text-xs font-black flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" /> Add member
        </button>
      </div>

      {pickerOpen && (
        <div className="rounded-2xl border border-[#2dd4bf]/30 bg-[#0f1a16] p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#2dd4bf] mb-2">
            Available people
          </p>
          {available.length === 0 ? (
            <p className="text-xs text-[#6b7280]">Everyone is already on this project.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-2">
              {available.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => add(m)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#141d18] border border-[#1e2a22] hover:border-[#2dd4bf]/40 text-left"
                >
                  <div
                    className={`w-9 h-9 rounded-full ${m.color} text-white text-xs font-bold flex items-center justify-center`}
                  >
                    {m.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{m.name}</p>
                    <p className="text-[10px] text-[#9ca3af]">{m.role}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {team.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#1e2a22] p-10 text-center">
          <p className="text-sm font-bold text-white">No team members</p>
          <p className="text-[11px] text-[#9ca3af] mt-1">Add people before assigning tasks.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {team.map((m) => (
            <div
              key={m.id}
              className="rounded-2xl bg-[#121915] border border-[#1e2d24] p-4 flex items-start gap-3"
            >
              <div
                className={`w-11 h-11 rounded-xl ${m.color} text-white text-sm font-black flex items-center justify-center shrink-0`}
              >
                {m.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white truncate">{m.name}</p>
                <p className="text-[11px] text-[#9ca3af]">{m.role}</p>
                <p className="text-[10px] text-[#6b7280] mt-1 truncate">{m.email}</p>
                <p className="text-[10px] text-[#2dd4bf] font-semibold mt-2">
                  {taskCounts[m.id] || 0} assigned tasks
                </p>
              </div>
              <button
                type="button"
                onClick={() => remove(m.id)}
                className="p-1.5 rounded-lg text-[#6b7280] hover:text-[#f87171]"
                title="Remove"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
