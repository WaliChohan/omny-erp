'use client';

import React, { useState, useEffect } from 'react';
import SideDrawer from '@/components/ui/SideDrawer';
import { Plus, Sparkles } from 'lucide-react';
import {
  Deal,
  DealStage,
  CRM_LEADS,
  LeadCard,
  PIPELINE_STAGES,
  LeadFilter,
  LeadSource,
} from '@/data/crmData';

interface NewDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDeal: (deal: Deal) => void;
  initialLead?: LeadCard | null;
}

export default function NewDealModal({
  isOpen,
  onClose,
  onAddDeal,
  initialLead,
}: NewDealModalProps) {
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [dealValue, setDealValue] = useState('50000');
  const [stage, setStage] = useState<DealStage>('prospecting');
  const [expectedCloseDate, setExpectedCloseDate] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');

  // Selected lead details
  const [avatarInitials, setAvatarInitials] = useState('JD');
  const [avatarColor, setAvatarColor] = useState('bg-[#7c3aed]');
  const [priority, setPriority] = useState<LeadFilter>('Hot Clients');
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [sources, setSources] = useState<LeadSource[]>(['LinkedIn']);

  // Handle lead selection
  const handleSelectLead = (leadId: string) => {
    setSelectedLeadId(leadId);
    const lead = CRM_LEADS.find((l) => l.id === leadId);
    if (lead) {
      setName(lead.company ? `${lead.company} — ${lead.name}` : lead.name);
      setTitle(lead.title);
      setAvatarInitials(lead.avatarInitials);
      setAvatarColor(lead.avatarColor);
      setPriority(lead.priority);
      setRating(lead.rating);
      setSources(lead.sources);
      if (lead.estimatedValue) {
        setDealValue(lead.estimatedValue.toString());
      }
      setNotes(`Enterprise deal initiated from ${lead.sources.join(', ')} lead record.`);
    }
  };

  // If opened with pre-selected lead
  useEffect(() => {
    if (initialLead) {
      handleSelectLead(initialLead.id);
    } else if (CRM_LEADS.length > 0 && !selectedLeadId) {
      handleSelectLead(CRM_LEADS[0].id);
    }
  }, [initialLead, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newDeal: Deal = {
      id: `deal-${Date.now()}`,
      name,
      title,
      avatarInitials,
      avatarColor,
      sources,
      priority,
      rating,
      stage,
      dealValue: parseFloat(dealValue) || 45000,
      expectedCloseDate,
      notes,
    };

    onAddDeal(newDeal);
    onClose();
  };

  return (
    <SideDrawer
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-xl"
      title={
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#00e676]/20 border border-[#00e676]/40 flex items-center justify-center text-[#00e676]">
            <Plus className="w-4 h-4 stroke-[3]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Add Deal to Pipeline</h3>
            <p className="text-[11px] text-[#9ca3af]">Link deal with existing client data or enter custom opportunity</p>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-[#9ca3af] hover:text-white text-xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 rounded-xl bg-[#00e676] hover:bg-[#00c764] text-black font-black text-xs shadow-md shadow-[#00e676]/20 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Deal</span>
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Quick Existing Client Selector */}
        <div className="p-3.5 rounded-xl bg-[#141d18] border border-[#1e2a22] space-y-2">
          <label className="text-xs font-bold text-[#00e676] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-fill from Existing Leads Database</span>
          </label>

          <select
            value={selectedLeadId}
            onChange={(e) => handleSelectLead(e.target.value)}
            className="w-full bg-[#0e1411] border border-[#273a2e] focus:border-[#00e676] rounded-xl px-3 py-2 text-white outline-none"
          >
            <option value="">Choose an existing client/lead...</option>
            {CRM_LEADS.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} — {l.title} ({l.priority})
              </option>
            ))}
          </select>
          <p className="text-[10px] text-[#6b7280]">
            Selecting a lead automatically pulls company, contact initials, rating, and sources into this deal.
          </p>
        </div>

        {/* Deal Title / Name */}
        <div>
          <label className="block text-[#d1d5db] font-semibold mb-1">Deal / Client Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Stripe — Enterprise Platform Expansion"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#141d18] border border-[#1e2a22] focus:border-[#00e676] rounded-xl px-3 py-2 text-white outline-none"
          />
        </div>

        <div>
          <label className="block text-[#d1d5db] font-semibold mb-1">Role / Subtitle</label>
          <input
            type="text"
            placeholder="e.g. Head of Product at Stripe"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#141d18] border border-[#1e2a22] focus:border-[#00e676] rounded-xl px-3 py-2 text-white outline-none"
          />
        </div>

        {/* Value & Stage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[#d1d5db] font-semibold mb-1">Deal Value ($ USD) *</label>
            <input
              type="number"
              required
              value={dealValue}
              onChange={(e) => setDealValue(e.target.value)}
              className="w-full bg-[#141d18] border border-[#1e2a22] focus:border-[#00e676] rounded-xl px-3 py-2 text-white font-mono outline-none"
            />
          </div>

          <div>
            <label className="block text-[#d1d5db] font-semibold mb-1">Pipeline Stage</label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as DealStage)}
              className="w-full bg-[#141d18] border border-[#1e2a22] focus:border-[#00e676] rounded-xl px-3 py-2 text-white outline-none"
            >
              {PIPELINE_STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Close Date */}
        <div>
          <label className="block text-[#d1d5db] font-semibold mb-1">Expected Close Date</label>
          <input
            type="date"
            required
            value={expectedCloseDate}
            onChange={(e) => setExpectedCloseDate(e.target.value)}
            className="w-full bg-[#141d18] border border-[#1e2a22] focus:border-[#00e676] rounded-xl px-3 py-2 text-white font-mono outline-none"
          />
        </div>

        {/* Deal Notes */}
        <div>
          <label className="block text-[#d1d5db] font-semibold mb-1">Opportunity Notes</label>
          <textarea
            rows={3}
            placeholder="Next action items, stakeholder requirements, SLA terms..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-[#141d18] border border-[#1e2a22] focus:border-[#00e676] rounded-xl p-2.5 text-white outline-none resize-none"
          />
        </div>
      </form>
    </SideDrawer>
  );
}
