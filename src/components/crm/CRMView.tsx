'use client';

import React, { useState } from 'react';
import { ArrowUpRight, Plus, ChevronDown, LayoutGrid, GitBranch } from 'lucide-react';
import SalesPipelineView from '@/components/crm/SalesPipelineView';
import {
  SCHEDULE_DATE,
  SCHEDULE_TOGGLES,
  WORKSPACE_METRICS,
  LEAD_FILTERS,
  CRM_LEADS,
  type LeadCard,
  type LeadFilter,
  type ScheduleToggle,
} from '@/data/crmData';

// ─── Sub-Components ──────────────────────────────────────────────────────────

/** Pill-style schedule toggle switch */
function ScheduleSwitch({ toggle }: { toggle: ScheduleToggle }) {
  const [on, setOn] = useState(toggle.active);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      aria-pressed={on}
      aria-label={`Toggle ${toggle.label}`}
      className={`relative flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all duration-300 border select-none ${
        on
          ? 'bg-[#b8ff00] border-[#b8ff00] text-black shadow-md shadow-[#b8ff00]/30'
          : 'bg-[#1a1a1a] border-[#2e2e2e] text-[#6b7280] hover:border-[#444]'
      }`}
    >
      {/* Toggle knob */}
      <span
        className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${
          on ? 'bg-black/30' : 'bg-[#2e2e2e]'
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full transition-colors ${
            on ? 'bg-black' : 'bg-[#6b7280]'
          }`}
        />
      </span>
      <span>{toggle.label}</span>
    </button>
  );
}

/** Source tag pill */
function SourceTag({ source }: { source: string }) {
  const colorMap: Record<string, string> = {
    LinkedIn: 'bg-[#0077b5]/20 text-[#38bdf8] border-[#0077b5]/30',
    Email: 'bg-[#1e2d24] text-[#9ca3af] border-[#2a3c30]',
    Referral: 'bg-[#7c3aed]/20 text-[#a78bfa] border-[#7c3aed]/30',
    'Cold Call': 'bg-[#f97316]/20 text-[#fb923c] border-[#f97316]/30',
    Twitter: 'bg-[#1da1f2]/20 text-[#7dd3fc] border-[#1da1f2]/30',
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
        colorMap[source] ?? 'bg-[#1e2d24] text-[#9ca3af] border-[#2a3c30]'
      }`}
    >
      {source}
    </span>
  );
}

/** 5-dot rating bar */
function RatingDots({ rating }: { rating: 1 | 2 | 3 | 4 | 5 }) {
  const colors = ['#ef4444', '#f97316', '#fbbf24', '#00e676', '#00e676'];
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full transition-all"
          style={{
            backgroundColor: i < rating ? colors[rating - 1] : '#2a2a2a',
            boxShadow: i < rating ? `0 0 4px ${colors[rating - 1]}80` : 'none',
          }}
        />
      ))}
    </div>
  );
}

/** Individual Lead Card matching reference image */
function LeadCardItem({ lead }: { lead: LeadCard }) {
  return (
    <div className="group relative bg-[#111111] border border-[#222222] hover:border-[#333333] rounded-2xl p-4 flex flex-col gap-3 transition-all duration-200 hover:shadow-xl hover:shadow-black/40 hover:-translate-y-0.5 min-w-[220px] max-w-[260px]">
      {/* Top Row: Avatar + External Link */}
      <div className="flex items-start justify-between">
        {/* Avatar */}
        <div
          className={`w-10 h-10 rounded-xl ${lead.avatarColor} flex items-center justify-center text-white font-black text-sm shadow-md ring-2 ring-black`}
        >
          {lead.avatarInitials}
        </div>
        {/* Link icon */}
        <button
          aria-label={`Open ${lead.name} profile`}
          className="w-7 h-7 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[#6b7280] hover:text-white hover:border-[#444] transition-all opacity-0 group-hover:opacity-100"
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Lead Info */}
      <div>
        <p className="text-sm font-bold text-white leading-tight">{lead.name}</p>
        <p className="text-[11px] text-[#6b7280] mt-0.5 leading-snug">{lead.title}</p>
      </div>

      {/* Source Tags */}
      <div>
        <p className="text-[10px] text-[#4b5563] uppercase tracking-widest font-bold mb-1.5">
          Source
        </p>
        <div className="flex flex-wrap gap-1">
          {lead.sources.map((s) => (
            <SourceTag key={s} source={s} />
          ))}
        </div>
      </div>

      {/* Priority + Rating */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold text-[#9ca3af] capitalize">
          {lead.priority.toLowerCase()}
        </span>
        <RatingDots rating={lead.rating} />
      </div>
    </div>
  );
}

// ─── Main CRM View ───────────────────────────────────────────────────────────

export default function CRMView() {
  const [crmSubTab, setCrmSubTab] = useState<'workspace' | 'pipeline'>('workspace');
  const [activeFilter, setActiveFilter] = useState<LeadFilter>('All');
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>(
    Object.fromEntries(SCHEDULE_TOGGLES.map((t) => [t.id, t.active]))
  );

  const filteredLeads =
    activeFilter === 'All'
      ? CRM_LEADS
      : CRM_LEADS.filter((l) => l.priority === activeFilter);

  const handleToggle = (id: string) =>
    setToggleStates((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="min-h-screen bg-[#0f0e0e] space-y-6 pb-16">

      {/* ── CRM Sub-Tab Switcher ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2 p-1 bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl w-fit">
        <button
          onClick={() => setCrmSubTab('workspace')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            crmSubTab === 'workspace'
              ? 'bg-[#b8ff00] text-black shadow-md shadow-[#b8ff00]/20'
              : 'text-[#6b7280] hover:text-white hover:bg-[#1a1a1a]'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          Workspace
        </button>
        <button
          onClick={() => setCrmSubTab('pipeline')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            crmSubTab === 'pipeline'
              ? 'bg-[#b8ff00] text-black shadow-md shadow-[#b8ff00]/20'
              : 'text-[#6b7280] hover:text-white hover:bg-[#1a1a1a]'
          }`}
        >
          <GitBranch className="w-3.5 h-3.5" />
          Sales Pipeline
        </button>
      </div>

      {/* ── Pipeline View ────────────────────────────────────────────────── */}
      {crmSubTab === 'pipeline' && <SalesPipelineView />}

      {/* ── Workspace View ───────────────────────────────────────────────── */}
      {crmSubTab === 'workspace' && <>

      {/* ── 1. YOUR SCHEDULE BAR ─────────────────────────────────────────── */}
      <div className="bg-[#f5f5f0] rounded-2xl px-6 py-4 flex flex-wrap items-center gap-4 shadow-sm">
        {/* Title */}
        <h2 className="text-base font-black text-black tracking-tight shrink-0">
          Your Schedule
        </h2>

        {/* Date Pill */}
        <div className="flex items-center gap-1.5 bg-white border border-[#e5e5e5] rounded-full px-3 py-1 shadow-sm shrink-0">
          <span className="w-4 h-4 rounded-full border-2 border-[#9ca3af] flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9ca3af]" />
          </span>
          <span className="text-xs font-semibold text-[#374151]">{SCHEDULE_DATE}</span>
        </div>

        {/* Toggle Group */}
        <div className="flex-1 flex flex-wrap items-center gap-2">
          {SCHEDULE_TOGGLES.map((t) => {
            const isOn = toggleStates[t.id];
            return (
              <button
                key={t.id}
                onClick={() => handleToggle(t.id)}
                aria-pressed={isOn}
                className={`relative flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold transition-all duration-300 border select-none ${
                  isOn
                    ? 'bg-[#b8ff00] border-[#b8ff00] text-black shadow-md shadow-[#b8ff00]/30'
                    : 'bg-white border-[#e0e0e0] text-[#6b7280] hover:border-[#aaa] hover:text-black'
                }`}
              >
                {/* Knob */}
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    isOn ? 'bg-black/20' : 'bg-[#e5e5e5]'
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isOn ? 'bg-black' : 'bg-[#9ca3af]'
                    }`}
                  />
                </span>
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right action toggle (large green pill from reference) */}
        <button className="flex items-center gap-2 bg-[#b8ff00] text-black font-bold text-xs px-5 py-2.5 rounded-full shadow-md shadow-[#b8ff00]/30 hover:scale-105 transition-transform shrink-0">
          <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-black" />
          </span>
          View All
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── 2. WORKSPACE METRICS & LEAD FILTERS ─────────────────────────── */}
      <div className="space-y-5">

        {/* Workspace Header Row */}
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-5xl font-black text-white tracking-tighter leading-none">
            WORK SPACE
          </h1>

          {/* + new task pill */}
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#2a2a2a] bg-[#141414] text-[#9ca3af] hover:border-[#444] hover:text-white text-xs font-semibold transition-all">
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            new task
          </button>

          {/* Metrics */}
          <div className="flex items-center gap-5 ml-2">
            {WORKSPACE_METRICS.map((m) => (
              <div key={m.id} className="flex items-start gap-1.5">
                <span className="text-3xl font-black text-white leading-none">{m.count}</span>
                <div className="flex flex-col mt-0.5">
                  <span
                    className={`w-3 h-3 rounded-full ${m.badgeColor} shadow-sm`}
                    aria-hidden
                  />
                  <span className="text-[11px] text-[#6b7280] font-semibold mt-0.5">
                    {m.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New Leads Header + Filter Row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Label group */}
          <div className="flex items-baseline gap-2 shrink-0">
            <h2 className="text-3xl font-black text-white tracking-tight">New Leads</h2>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-black text-white">{CRM_LEADS.length}</span>
              <span className="text-sm font-semibold text-[#9ca3af] underline underline-offset-2 cursor-pointer">
                Leads
              </span>
            </div>
          </div>

          {/* Avatar stubs (team / view indicators from screenshot) */}
          <div className="flex items-center -space-x-2 shrink-0">
            {['#6b7280', '#4b5563'].map((c, i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-full border-2 border-[#0f0e0e]"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {LEAD_FILTERS.map((f) => {
              const isActive = activeFilter === f;
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border ${
                    isActive
                      ? 'bg-white text-black border-white shadow-sm'
                      : 'bg-transparent text-[#9ca3af] border-[#2a2a2a] hover:border-[#444] hover:text-white'
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 3. LEAD CARDS GRID ───────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-4">
        {filteredLeads.length === 0 ? (
          <div className="w-full text-center py-16">
            <p className="text-[#6b7280] text-sm">No leads match this filter.</p>
          </div>
        ) : (
          filteredLeads.map((lead) => <LeadCardItem key={lead.id} lead={lead} />)
        )}
      </div>
      </>}
    </div>
  );
}
