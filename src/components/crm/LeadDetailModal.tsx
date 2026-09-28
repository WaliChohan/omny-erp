'use client';

import React from 'react';
import SideDrawer from '@/components/ui/SideDrawer';
import {
  Mail,
  Phone,
  Building,
  Plus,
  FileText,
  Clock,
  ShieldCheck,
  CheckCircle2,
  UserPlus,
  Briefcase,
  Receipt,
} from 'lucide-react';
import { LeadCard } from '@/data/crmData';

interface LeadDetailModalProps {
  lead: LeadCard | null;
  isOpen: boolean;
  onClose: () => void;
  onConvertToDeal?: (lead: LeadCard) => void;
  onConvertToClient?: (lead: LeadCard) => void;
  onCreateQuote?: (lead: LeadCard) => void;
  onCreateProject?: (lead: LeadCard) => void;
  onCreateDoc?: (lead: LeadCard) => void;
}

export default function LeadDetailModal({
  lead,
  isOpen,
  onClose,
  onConvertToDeal,
  onConvertToClient,
  onCreateQuote,
  onCreateProject,
  onCreateDoc,
}: LeadDetailModalProps) {
  if (!lead) return null;

  return (
    <SideDrawer
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-xl"
      title={
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl ${lead.avatarColor} text-white font-black text-sm flex items-center justify-center shadow-lg shrink-0`}
          >
            {lead.avatarInitials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">{lead.name}</h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#b8ff00]/15 text-[#b8ff00] border border-[#b8ff00]/30">
                <ShieldCheck className="w-3 h-3" />
                {lead.status || 'Lead'}
              </span>
            </div>
            <p className="text-xs text-[#9ca3af]">
              {lead.title} {lead.company ? `· ${lead.company}` : ''}
            </p>
          </div>
        </div>
      }
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2 w-full">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#181818] hover:bg-[#222] text-[#9ca3af] hover:text-white text-xs font-semibold transition-colors"
          >
            Close
          </button>

          <div className="flex flex-wrap items-center gap-2 justify-end">
            {onCreateQuote && (
              <button
                type="button"
                onClick={() => {
                  onCreateQuote(lead);
                  onClose();
                }}
                className="px-3 py-2 rounded-xl bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-[#333] text-white text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-[#38bdf8]" />
                Quote
              </button>
            )}
            {onCreateProject && (
              <button
                type="button"
                onClick={() => {
                  onCreateProject(lead);
                  onClose();
                }}
                className="px-3 py-2 rounded-xl bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-[#333] text-white text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Briefcase className="w-3.5 h-3.5 text-[#a78bfa]" />
                Project
              </button>
            )}
            {onCreateDoc && (
              <button
                type="button"
                onClick={() => {
                  onCreateDoc(lead);
                  onClose();
                }}
                className="px-3 py-2 rounded-xl bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-[#333] text-white text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Receipt className="w-3.5 h-3.5 text-[#10b981]" />
                SOW
              </button>
            )}
            {onConvertToClient && (
              <button
                type="button"
                onClick={() => {
                  onConvertToClient(lead);
                  onClose();
                }}
                className="px-3 py-2 rounded-xl bg-[#2dd4bf] hover:bg-[#5eead4] text-[#052e24] font-bold text-xs flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                To client
              </button>
            )}
            {onConvertToDeal && (
              <button
                type="button"
                onClick={() => {
                  onConvertToDeal(lead);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-[#b8ff00] hover:bg-[#a3e600] text-black font-bold text-xs shadow-md shadow-[#b8ff00]/20 flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                To deal
              </button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-5 text-xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-[#141d18] border border-[#1e2a22] rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold text-[#6b7280] tracking-wider block">
              Priority
            </span>
            <span className="text-xs font-bold text-white capitalize mt-0.5 block">
              {lead.priority}
            </span>
          </div>
          <div className="bg-[#141d18] border border-[#1e2a22] rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold text-[#6b7280] tracking-wider block">
              Rating
            </span>
            <div className="flex items-center gap-1 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${
                    i < lead.rating ? 'bg-[#b8ff00]' : 'bg-[#2a2a2a]'
                  }`}
                />
              ))}
              <span className="text-[11px] font-mono font-bold text-white ml-1">
                {lead.rating}/5
              </span>
            </div>
          </div>
          <div className="bg-[#141d18] border border-[#1e2a22] rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold text-[#6b7280] tracking-wider block">
              Est. Deal
            </span>
            <span className="text-xs font-bold text-[#00e676] font-mono mt-0.5 block">
              PKR {(lead.estimatedValue || 45000).toLocaleString()}
            </span>
          </div>
          <div className="bg-[#141d18] border border-[#1e2a22] rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold text-[#6b7280] tracking-wider block">
              Status
            </span>
            <span className="text-xs font-bold text-[#38bdf8] capitalize mt-0.5 block">
              {lead.status || 'Qualified'}
            </span>
          </div>
        </div>

        <div className="space-y-3 bg-[#141d18] border border-[#1e2a22] rounded-xl p-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Contact Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#1a2620] text-[#b8ff00] flex items-center justify-center shrink-0">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-[#6b7280] block">Email</span>
                <span className="text-white font-mono truncate block text-[11px]">
                  {lead.email ||
                    `${lead.name.toLowerCase().replace(/\s+/g, '')}@company.com`}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#1a2620] text-[#38bdf8] flex items-center justify-center shrink-0">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-[#6b7280] block">Phone</span>
                <span className="text-white font-mono truncate block text-[11px]">
                  {lead.phone || '+1 (415) 555-0188'}
                </span>
              </div>
            </div>
          </div>
          {lead.company && (
            <div className="pt-2.5 border-t border-[#1e2a22] flex items-center gap-2">
              <Building className="w-3.5 h-3.5 text-[#9ca3af]" />
              <span className="text-white text-[11px] font-semibold">{lead.company}</span>
            </div>
          )}
          <div className="pt-2.5 border-t border-[#1e2a22] flex items-center justify-between">
            <span className="text-[#9ca3af] text-[11px]">Sources:</span>
            <div className="flex flex-wrap gap-1.5">
              {lead.sources.map((s) => (
                <span
                  key={s}
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1a2620] text-[#b8ff00] border border-[#273a2e]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Agency flow</h3>
          <p className="text-[11px] text-[#9ca3af] leading-relaxed">
            Convert this lead into a client account, then spin up a project and quote/invoice from
            the same record chain. Deals still live in the Sales Pipeline tab.
          </p>
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-[#141d18] border border-[#1e2a22] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#b8ff00]" />
                <span className="text-white font-medium">Discovery call logged</span>
              </div>
              <span className="text-[10px] font-mono text-[#6b7280]">Recent</span>
            </div>
            <div className="p-3 rounded-xl bg-[#141d18] border border-[#1e2a22] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#38bdf8]" />
                <span className="text-white font-medium">Ready for quote / client conversion</span>
              </div>
              <span className="text-[10px] font-mono text-[#6b7280]">Now</span>
            </div>
          </div>
        </div>
      </div>
    </SideDrawer>
  );
}
