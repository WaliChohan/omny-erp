'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  ArrowUpRight,
  GripVertical,
  Target,
  TrendingUp,
  Search,
  Phone,
  UserPlus,
} from 'lucide-react';
import {
  LEAD_PIPELINE_STAGES,
  type LeadCard,
  type LeadPipelineStatus,
  LEAD_FILTERS,
  type LeadFilter,
} from '@/data/crmData';
import { useAgency } from '@/context/AgencyContext';
import LeadDetailModal from '@/components/crm/LeadDetailModal';

function SourceTag({ source }: { source: string }) {
  const colorMap: Record<string, string> = {
    LinkedIn: 'bg-[#0077b5]/20 text-[#38bdf8] border-[#0077b5]/30',
    Email: 'bg-[#1e2d24] text-[#9ca3af] border-[#2a3c30]',
    Referral: 'bg-[#7c3aed]/20 text-[#a78bfa] border-[#7c3aed]/30',
    'Cold Call': 'bg-[#f97316]/20 text-[#fb923c] border-[#f97316]/30',
    Twitter: 'bg-[#1da1f2]/20 text-[#7dd3fc] border-[#1da1f2]/30',
    Website: 'bg-[#10b981]/20 text-[#34d399] border-[#10b981]/30',
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

function EmptyColumnState({ stageLabel }: { stageLabel: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 px-4">
      <div className="w-14 h-14 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
        <Target className="w-6 h-6 text-[#3a3a3a]" />
      </div>
      <div className="text-center">
        <p className="text-xs font-bold text-[#4b5563]">No leads in</p>
        <p className="text-xs font-bold text-[#3a3a3a]">{stageLabel}</p>
      </div>
    </div>
  );
}

interface SalesPipelineViewProps {
  initialPreselectedLead?: LeadCard | null;
}

export default function SalesPipelineView({ initialPreselectedLead }: SalesPipelineViewProps) {
  const {
    leads,
    updateLead,
    addLead,
    deleteLead,
    convertLeadToClient,
    createDocument,
    createProjectForClient,
    clients,
  } = useAgency();

  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<LeadFilter | 'All'>('All');
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<LeadPipelineStatus | null>(null);
  const [detailLead, setDetailLead] = useState<LeadCard | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [formName, setFormName] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formValue, setFormValue] = useState('50000');

  useEffect(() => {
    if (initialPreselectedLead) {
      const live = leads.find((l) => l.id === initialPreselectedLead.id) || initialPreselectedLead;
      setDetailLead(live);
      setDetailOpen(true);
    }
  }, [initialPreselectedLead, leads]);

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (priorityFilter !== 'All' && l.priority !== priorityFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        l.name.toLowerCase().includes(q) ||
        (l.company || '').toLowerCase().includes(q) ||
        (l.email || '').toLowerCase().includes(q) ||
        (l.phone || '').toLowerCase().includes(q)
      );
    });
  }, [leads, search, priorityFilter]);

  const byStage = useMemo(() => {
    const map: Record<LeadPipelineStatus, LeadCard[]> = {
      New: [],
      Contacted: [],
      Qualified: [],
      Proposal: [],
      Converted: [],
      Lost: [],
    };
    for (const lead of filtered) {
      const stage = (lead.status || 'New') as LeadPipelineStatus;
      (map[stage] || map.New).push(lead);
    }
    return map;
  }, [filtered]);

  const moveLead = (id: string, stage: LeadPipelineStatus) => {
    const lead = leads.find((l) => l.id === id);
    if (!lead || lead.status === stage) return;
    updateLead({ ...lead, status: stage });
    if (stage === 'Converted') {
      convertLeadToClient(id);
    }
  };

  const onDrop = (stage: LeadPipelineStatus) => {
    if (draggingId) moveLead(draggingId, stage);
    setDraggingId(null);
    setDragOverStage(null);
  };

  const totalPipeline = filtered
    .filter((l) => l.status !== 'Lost' && l.status !== 'Converted')
    .reduce((a, l) => a + (l.estimatedValue || 0), 0);
  const wonValue = filtered
    .filter((l) => l.status === 'Converted')
    .reduce((a, l) => a + (l.estimatedValue || 0), 0);
  const winRate = filtered.length
    ? Math.round((filtered.filter((l) => l.status === 'Converted').length / filtered.length) * 100)
    : 0;

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;
    const initials = formName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    const lead: LeadCard = {
      id: `lead-${Date.now()}`,
      name: formName.trim(),
      company: formCompany.trim() || undefined,
      title: formCompany ? `Contact at ${formCompany}` : 'Prospect',
      email: formEmail.trim() || undefined,
      phone: formPhone.trim() || undefined,
      avatarInitials: initials || 'LD',
      avatarColor: 'bg-[#7c3aed]',
      sources: ['Website'],
      priority: 'Hot Clients',
      rating: 4,
      status: 'New',
      estimatedValue: parseFloat(formValue) || 35000,
      createdDate: new Date().toISOString().slice(0, 10),
    };
    addLead(lead);
    setShowAdd(false);
    setFormName('');
    setFormCompany('');
    setFormPhone('');
    setFormEmail('');
    setDetailLead(lead);
    setDetailOpen(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">Sales Pipeline</h2>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            Lead stages as live kanban — drag to advance, convert wins clients
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 rounded-xl bg-[#b8ff00] text-black text-xs font-black flex items-center gap-1.5 shadow-md shadow-[#b8ff00]/20"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Add lead
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl">
        {[
          { label: 'Open pipeline', value: `$${totalPipeline.toLocaleString()}`, accent: 'text-white' },
          { label: 'Won value', value: `$${wonValue.toLocaleString()}`, accent: 'text-[#00e676]' },
          { label: 'Win rate', value: `${winRate}%`, accent: 'text-[#38bdf8]' },
          { label: 'Leads', value: `${filtered.length}`, accent: 'text-[#fbbf24]' },
        ].map((s, i) => (
          <React.Fragment key={s.label}>
            {i > 0 && <div className="w-px h-6 bg-[#1e1e1e]" />}
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-[#4b5563] uppercase tracking-widest font-bold">{s.label}</span>
              <span className={`text-base font-black leading-none ${s.accent}`}>{s.value}</span>
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 bg-[#111] border border-[#222] rounded-xl p-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pipeline…"
            className="w-full bg-[#181818] border border-[#2a2a2a] focus:border-[#b8ff00] rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none"
          />
        </div>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as LeadFilter | 'All')}
          className="bg-[#181818] border border-[#2a2a2a] rounded-xl px-3 py-2 text-xs text-white outline-none"
        >
          <option value="All">All priorities</option>
          {LEAD_FILTERS.filter((f) => f !== 'All').map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#2a2a2a] bg-[#111] py-16 text-center">
          <Target className="w-10 h-10 text-[#3a3a3a] mx-auto mb-3" />
          <p className="text-sm font-bold text-[#6b7280]">No leads match this filter</p>
          <p className="text-xs text-[#4b5563] mt-1">Add a lead or clear search to populate the pipeline</p>
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-[#b8ff00] text-black text-xs font-bold"
          >
            Add first lead
          </button>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {LEAD_PIPELINE_STAGES.map((stage) => {
            const column = byStage[stage.id] || [];
            const colValue = column.reduce((a, l) => a + (l.estimatedValue || 0), 0);
            const isOver = dragOverStage === stage.id;
            return (
              <div
                key={stage.id}
                className="flex flex-col gap-3 min-w-[240px] flex-1"
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverStage(stage.id);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  onDrop(stage.id);
                }}
                onDragLeave={() => setDragOverStage(null)}
              >
                <div
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border ${stage.borderColor} bg-[#0d0d0d]`}
                  style={isOver ? { borderColor: stage.glowColor, backgroundColor: `${stage.glowColor}10` } : undefined}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black shrink-0 ${stage.badgeColor} ${stage.textColor}`}>
                      {stage.label}
                    </span>
                    <span className="w-5 h-5 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-[10px] font-bold text-[#9ca3af] flex items-center justify-center">
                      {column.length}
                    </span>
                  </div>
                  {column.length > 0 && (
                    <span className="text-[10px] font-bold text-[#4b5563] font-mono">${colValue.toLocaleString()}</span>
                  )}
                </div>

                <div
                  className={`flex-1 flex flex-col gap-2.5 min-h-[120px] p-2 rounded-xl border border-dashed ${
                    isOver ? 'border-[#444] bg-[#111]' : 'border-[#1a1a1a]'
                  }`}
                >
                  {column.length === 0 ? (
                    <EmptyColumnState stageLabel={stage.label} />
                  ) : (
                    column.map((lead) => (
                      <div
                        key={lead.id}
                        draggable
                        onDragStart={() => setDraggingId(lead.id)}
                        onDragEnd={() => {
                          setDraggingId(null);
                          setDragOverStage(null);
                        }}
                        className={`group relative bg-[#111111] border border-[#1e1e1e] rounded-xl p-3.5 flex flex-col gap-2.5 cursor-grab active:cursor-grabbing ${
                          draggingId === lead.id ? 'opacity-40 scale-95' : 'hover:border-[#333] hover:-translate-y-0.5'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <GripVertical className="w-3.5 h-3.5 text-[#3a3a3a] mt-0.5 shrink-0" />
                          <div className="flex-1 flex items-start justify-between gap-1">
                            <div className="flex items-start gap-2 min-w-0">
                              <div
                                className={`w-8 h-8 rounded-lg ${lead.avatarColor} flex items-center justify-center text-white font-black text-[11px] shrink-0`}
                              >
                                {lead.avatarInitials}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-white truncate">{lead.name}</p>
                                <p className="text-[10px] text-[#6b7280] line-clamp-2">{lead.company || lead.title}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setDetailLead(lead);
                                setDetailOpen(true);
                              }}
                              className="w-6 h-6 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[#6b7280] hover:text-white opacity-0 group-hover:opacity-100"
                            >
                              <ArrowUpRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 bg-[#0a0a0a] border border-[#1e1e1e] rounded-lg px-2.5 py-1">
                            <TrendingUp className="w-3 h-3 text-[#00e676]" />
                            <span className="text-xs font-black text-white font-mono">
                              ${(lead.estimatedValue || 0).toLocaleString()}
                            </span>
                          </div>
                          {lead.phone && (
                            <a
                              href={`tel:${lead.phone.replace(/[^0-9+]/g, '')}`}
                              className="text-[#2dd4bf] hover:text-[#5eead4]"
                              title="Call"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {lead.sources.slice(0, 2).map((s) => (
                            <SourceTag key={s} source={s} />
                          ))}
                        </div>
                        <div className="flex gap-1.5 pt-1 border-t border-[#1a1a1a]">
                          <button
                            type="button"
                            onClick={() => convertLeadToClient(lead.id, { createProject: true })}
                            className="flex-1 text-[10px] font-bold py-1.5 rounded-lg bg-[#141d18] border border-[#1e2a22] text-[#2dd4bf] flex items-center justify-center gap-1"
                          >
                            <UserPlus className="w-3 h-3" /> Client+Project
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <form
            onSubmit={handleAddLead}
            className="w-full max-w-md rounded-2xl bg-[#111] border border-[#222] p-5 space-y-3 shadow-2xl"
          >
            <h3 className="text-sm font-black text-white">New pipeline lead</h3>
            {[
              ['Name *', formName, setFormName, 'text'],
              ['Company', formCompany, setFormCompany, 'text'],
              ['Email', formEmail, setFormEmail, 'email'],
              ['Phone', formPhone, setFormPhone, 'tel'],
              ['Est. value', formValue, setFormValue, 'number'],
            ].map(([label, val, set, type]) => (
              <label key={label as string} className="block">
                <span className="text-[10px] uppercase font-bold text-[#6b7280]">{label as string}</span>
                <input
                  type={type as string}
                  value={val as string}
                  onChange={(e) => (set as (v: string) => void)(e.target.value)}
                  className="mt-1 w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#b8ff00]"
                />
              </label>
            ))}
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowAdd(false)} className="px-3 py-2 text-xs text-[#9ca3af]">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-[#b8ff00] text-black text-xs font-bold">
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      <LeadDetailModal
        lead={detailLead ? leads.find((l) => l.id === detailLead.id) || detailLead : null}
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        queue={filtered}
        onOpenLead={(l) => setDetailLead(l)}
        onConvertToClient={(l) => convertLeadToClient(l.id, { createProject: true })}
        onConvertToDeal={(l) => {
          updateLead({ ...l, status: 'Proposal' });
        }}
        onCreateQuote={(l) => {
          let client = clients.find((c) => c.leadId === l.id || c.email === l.email);
          if (!client) client = convertLeadToClient(l.id) || undefined;
          createDocument({
            docType: 'quotation',
            clientId: client?.id,
            leadId: l.id,
            title: `Quote — ${l.company || l.name}`,
            amount: l.estimatedValue || 500000,
          });
        }}
        onCreateProject={(l) => {
          let client = clients.find((c) => c.leadId === l.id || c.email === l.email);
          if (!client) client = convertLeadToClient(l.id) || undefined;
          if (client) {
            createProjectForClient(client.id, {
              title: `${client.company} — Engagement`,
              budget: l.estimatedValue || 500000,
            });
          }
        }}
        onDelete={(l) => {
          if (confirm(`Delete lead ${l.name}?`)) {
            deleteLead(l.id);
            setDetailOpen(false);
          }
        }}
      />
    </div>
  );
}
