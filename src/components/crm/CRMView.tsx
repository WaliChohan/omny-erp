'use client';

import React, { useState, useEffect } from 'react';
import { useAgency } from '@/context/AgencyContext';
import { ArrowUpRight, Plus, ChevronDown, LayoutGrid, GitBranch, Database, Upload } from 'lucide-react';
import SalesPipelineView from '@/components/crm/SalesPipelineView';
import LeadsDatabaseView from '@/components/crm/LeadsDatabaseView';
import BulkImportLeadsModal from '@/components/crm/BulkImportLeadsModal';
import LeadDetailModal from '@/components/crm/LeadDetailModal';
import FolderCard from '@/components/common/FolderCard';
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
    Website: 'bg-[#10b981]/20 text-[#34d399] border-[#10b981]/30',
    'Google Ads': 'bg-[#f59e0b]/20 text-[#fbbf24] border-[#f59e0b]/30',
    Partner: 'bg-[#8b5cf6]/20 text-[#c4b5fd] border-[#8b5cf6]/30',
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

/** 5-dot colored rating pill matching reference image exactly */
function RatingDotsPill({ rating, priority }: { rating: 1 | 2 | 3 | 4 | 5; priority: string }) {
  // Reference image has orange, dark orange, neon green, yellow, pink dots
  const dotPalette = ['#f97316', '#ea580c', '#00e676', '#eab308', '#f472b6'];
  return (
    <div className="flex flex-col items-end gap-1">
      <span className="text-[10px] text-[#8e8e8e] font-normal lowercase tracking-wide">
        {priority.toLowerCase()}
      </span>
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#2a2a2a] bg-[#141414] shadow-inner">
        {dotPalette.map((color, i) => (
          <span
            key={i}
            className="w-2.5 h-2.5 rounded-full transition-transform"
            style={{
              backgroundColor: i < rating ? color : '#2a2a2a',
              boxShadow: i < rating ? `0 0 6px ${color}80` : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}

/** Individual Lead Card with Folder-tab shape and circular arrow button matching reference image */
function LeadCardItem({
  lead,
  onOpenDetail,
}: {
  lead: LeadCard;
  onOpenDetail: (lead: LeadCard) => void;
}) {
  const isMurtaza = lead.name.toLowerCase().includes('murtaza');

  return (
    <div className="w-[270px] cursor-pointer" onClick={() => onOpenDetail(lead)}>
      <FolderCard
        onOpenDetail={() => onOpenDetail(lead)}
        actionTooltip={`Open ${lead.name} details`}
        avatar={
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#2a2a2a] bg-[#1a2e22] flex items-center justify-center shadow-lg">
            {isMurtaza ? (
              // 3D Avatar representation with cap matching user reference image
              <div className="w-full h-full bg-gradient-to-b from-[#225534] to-[#143320] flex items-center justify-center text-white text-xl font-black">
                🧢
              </div>
            ) : (
              <div
                className={`w-full h-full ${lead.avatarColor} flex items-center justify-center text-white font-black text-sm`}
              >
                {lead.avatarInitials}
              </div>
            )}
          </div>
        }
      >
        <div className="space-y-3 pt-1">
          {/* Lead Name & Position */}
          <div>
            <h3 className="text-lg font-black text-white tracking-tight leading-tight">
              {lead.name}
            </h3>
            <p className="text-xs text-[#8e8e8e] font-normal leading-snug mt-0.5 line-clamp-1">
              {lead.title}
            </p>
          </div>

          {/* Sources & Rating Bottom Row */}
          <div>
            <p className="text-[10px] text-[#555] uppercase tracking-widest font-bold mb-1.5">
              Source
            </p>
            <div className="flex items-end justify-between gap-2">
              {/* Source pills */}
              <div className="flex flex-wrap gap-1">
                {lead.sources.map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-medium border border-[#2a2a2a] text-[#8e8e8e] bg-[#141414]"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Priority & Colored Dots Pill */}
              <RatingDotsPill rating={lead.rating} priority={lead.priority} />
            </div>
          </div>
        </div>
      </FolderCard>
    </div>
  );
}

// ─── Main CRM View ───────────────────────────────────────────────────────────

export default function CRMView() {
  const {
    convertLeadToClient,
    createDocument,
    createProjectForClient,
    consumeFocus,
    clients,
    leads: agencyLeads,
    importLeads,
  } = useAgency();
  const [crmSubTab, setCrmSubTab] = useState<'workspace' | 'pipeline' | 'database'>('workspace');
  const [activeFilter, setActiveFilter] = useState<LeadFilter>('All');
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [activeDetailLead, setActiveDetailLead] = useState<LeadCard | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedLeadForDeal, setSelectedLeadForDeal] = useState<LeadCard | null>(null);
  const leadsList = agencyLeads;

  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>(
    Object.fromEntries(SCHEDULE_TOGGLES.map((t) => [t.id, t.active]))
  );

  const filteredLeads =
    activeFilter === 'All'
      ? leadsList
      : leadsList.filter((l) => l.priority === activeFilter);

  const handleToggle = (id: string) =>
    setToggleStates((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleBulkImport = (imported: LeadCard[]) => {
    importLeads(imported);
  };

  useEffect(() => {
    const id = consumeFocus('lead');
    if (!id) return;
    const lead = leadsList.find((l) => l.id === id) || CRM_LEADS.find((l) => l.id === id);
    if (lead) {
      setActiveDetailLead(lead);
      setIsDetailModalOpen(true);
      setCrmSubTab('workspace');
    }
  }, [consumeFocus, leadsList]);

  const handleConvertToDeal = (lead: LeadCard) => {
    setSelectedLeadForDeal(lead);
    setCrmSubTab('pipeline');
  };

  const handleConvertToClient = (lead: LeadCard) => {
    convertLeadToClient(lead.id);
  };

  const handleCreateQuote = (lead: LeadCard) => {
    let client = clients.find((c) => c.leadId === lead.id || c.email === lead.email);
    if (!client) client = convertLeadToClient(lead.id) || undefined;
    createDocument({
      docType: 'quotation',
      clientId: client?.id,
      leadId: lead.id,
      title: `Quote — ${lead.company || lead.name}`,
      amount: lead.estimatedValue || 500000,
      description: `Proposal for ${lead.company || lead.name}`,
    });
  };

  const handleCreateProject = (lead: LeadCard) => {
    let client = clients.find((c) => c.leadId === lead.id || c.email === lead.email);
    if (!client) client = convertLeadToClient(lead.id) || undefined;
    if (client) {
      createProjectForClient(client.id, {
        title: `${client.company} — Engagement`,
        category: 'Website',
        budget: lead.estimatedValue || 500000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0e0e] space-y-6 pb-16">

      {/* ── CRM Sub-Tab Switcher ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
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
          <button
            onClick={() => setCrmSubTab('database')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              crmSubTab === 'database'
                ? 'bg-[#b8ff00] text-black shadow-md shadow-[#b8ff00]/20'
                : 'text-[#6b7280] hover:text-white hover:bg-[#1a1a1a]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Leads Database
          </button>
        </div>

        <button
          onClick={() => setIsBulkImportOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1a1a1a] border border-[#2e2e2e] hover:border-[#b8ff00] text-xs font-bold text-white transition-all shadow-sm"
        >
          <Upload className="w-3.5 h-3.5 text-[#b8ff00]" />
          <span>Bulk Import Leads</span>
        </button>
      </div>

      {/* ── Leads Database View ──────────────────────────────────────────── */}
      {crmSubTab === 'database' && (
        <LeadsDatabaseView onConvertToDeal={handleConvertToDeal} />
      )}

      {/* ── Pipeline View ────────────────────────────────────────────────── */}
      {crmSubTab === 'pipeline' && (
        <SalesPipelineView initialPreselectedLead={selectedLeadForDeal} />
      )}

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
          filteredLeads.map((lead) => (
            <LeadCardItem
              key={lead.id}
              lead={lead}
              onOpenDetail={(l) => {
                setActiveDetailLead(l);
                setIsDetailModalOpen(true);
              }}
            />
          ))
        )}
      </div>
      </>}

      {/* Bulk Import Leads Modal */}
      <BulkImportLeadsModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        entity="leads"
        onImportLeads={handleBulkImport}
      />

      {/* Lead Detail Dossier Modal (Opened by Circle Arrow Button) */}
      <LeadDetailModal
        lead={activeDetailLead}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        queue={leadsList}
        onOpenLead={(lead) => {
          setActiveDetailLead(lead);
          setIsDetailModalOpen(true);
        }}
        onConvertToDeal={handleConvertToDeal}
        onConvertToClient={handleConvertToClient}
        onCreateQuote={handleCreateQuote}
        onCreateProject={handleCreateProject}
        onCreateDoc={(lead) =>
          createDocument({
            docType: 'sow',
            leadId: lead.id,
            title: `SOW — ${lead.company || lead.name}`,
            amount: lead.estimatedValue || 500000,
          })
        }
      />
    </div>
  );
}
