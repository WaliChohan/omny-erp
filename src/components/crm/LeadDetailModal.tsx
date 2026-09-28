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
import CallDialerPanel from '@/components/crm/CallDialerPanel';
import { useAgency } from '@/context/AgencyContext';
import { LEAD_PIPELINE_STAGES } from '@/data/crmData';

interface LeadDetailModalProps {
  lead: LeadCard | null;
  isOpen: boolean;
  onClose: () => void;
  onConvertToDeal?: (lead: LeadCard) => void;
  onConvertToClient?: (lead: LeadCard) => void;
  onCreateQuote?: (lead: LeadCard) => void;
  onCreateProject?: (lead: LeadCard) => void;
  onCreateDoc?: (lead: LeadCard) => void;
  queue?: LeadCard[];
  onOpenLead?: (lead: LeadCard) => void;
  onDelete?: (lead: LeadCard) => void;
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
  queue = [],
  onOpenLead,
  onDelete,
}: LeadDetailModalProps) {
  const { updateLead, clients, projects, navigate, getLeadActivities } = useAgency();
  const [editing, setEditing] = React.useState(false);
  const [name, setName] = React.useState('');
  const [company, setCompany] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [value, setValue] = React.useState('');
  const [title, setTitle] = React.useState('');

  React.useEffect(() => {
    if (!lead) return;
    setName(lead.name);
    setCompany(lead.company || '');
    setEmail(lead.email || '');
    setPhone(lead.phone || '');
    setValue(String(lead.estimatedValue || 0));
    setTitle(lead.title || '');
    setEditing(false);
  }, [lead?.id]);

  if (!lead) return null;

  const linkedClient = clients.find((c) => c.leadId === lead.id || (lead.email && c.email === lead.email));
  const linkedProjects = linkedClient ? projects.filter((p) => p.clientId === linkedClient.id) : [];
  const activityCount = getLeadActivities(lead.id).length;

  const saveEdit = () => {
    updateLead({
      ...lead,
      name: name.trim() || lead.name,
      company: company.trim() || undefined,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      title: title.trim() || lead.title,
      estimatedValue: parseFloat(value) || lead.estimatedValue,
    });
    setEditing(false);
  };

  return (
    <SideDrawer
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-2xl"
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
            {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(lead)}
            className="px-3 py-2 rounded-xl border border-[#7f1d1d]/50 text-[#f87171] text-xs font-bold"
          >
            Delete lead
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
                <a href={`mailto:${lead.email || ''}`} className="text-white font-mono truncate block text-[11px] hover:text-[#b8ff00]">
                  {lead.email ||
                    `${lead.name.toLowerCase().replace(/\s+/g, '')}@company.com`}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#1a2620] text-[#38bdf8] flex items-center justify-center shrink-0">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-[#6b7280] block">Phone</span>
                <a href={`tel:${(lead.phone || '').replace(/[^0-9+]/g, '')}`} className="text-white font-mono truncate block text-[11px] hover:text-[#38bdf8]">
                  {lead.phone || '+1 (415) 555-0188'}
                </a>
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

        <div className="space-y-2 bg-[#141d18] border border-[#1e2a22] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Pipeline stage</h3>
            <button type="button" onClick={() => setEditing((v) => !v)} className="text-[10px] font-bold text-[#b8ff00]">
              {editing ? 'Cancel edit' : 'Edit lead'}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {LEAD_PIPELINE_STAGES.map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => updateLead({ ...lead, status: st.id })}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                  (lead.status || 'New') === st.id
                    ? st.badgeColor + ' ' + st.textColor + ' border-transparent'
                    : 'border-[#1e2a22] text-[#6b7280] hover:text-white'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
          {editing && (
            <div className="grid sm:grid-cols-2 gap-2 pt-2 border-t border-[#1e2a22]">
              {[
                ['Name', name, setName],
                ['Title', title, setTitle],
                ['Company', company, setCompany],
                ['Email', email, setEmail],
                ['Phone', phone, setPhone],
                ['Est. value', value, setValue],
              ].map(([label, val, set]) => (
                <label key={label as string} className="block">
                  <span className="text-[9px] uppercase text-[#6b7280] font-bold">{label as string}</span>
                  <input
                    value={val as string}
                    onChange={(e) => (set as React.Dispatch<React.SetStateAction<string>>)(e.target.value)}
                    className="mt-0.5 w-full bg-[#0b1210] border border-[#1e2a22] rounded-lg px-2 py-1.5 text-[11px] text-white outline-none focus:border-[#b8ff00]"
                  />
                </label>
              ))}
              <button type="button" onClick={saveEdit} className="sm:col-span-2 mt-1 py-2 rounded-xl bg-[#b8ff00] text-black text-xs font-bold">
                Save changes
              </button>
            </div>
          )}
          <div className="pt-2 border-t border-[#1e2a22] text-[11px] text-[#9ca3af] space-y-1">
            <p>{activityCount} logged activities · dialer timeline below</p>
            {linkedClient ? (
              <button type="button" className="text-[#2dd4bf] font-semibold hover:underline" onClick={() => navigate({ tab: 'clients', focus: { kind: 'client', id: linkedClient.id } })}>
                Linked client: {linkedClient.company}
              </button>
            ) : (
              <p>Not converted to client yet</p>
            )}
            {linkedProjects.length > 0 && (
              <button type="button" className="block text-[#a78bfa] font-semibold hover:underline" onClick={() => navigate({ tab: 'projects', focus: { kind: 'project', id: linkedProjects[0].id } })}>
                Project: {linkedProjects[0].title}
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Agency flow</h3>
          <p className="text-[11px] text-[#9ca3af] leading-relaxed">
            Convert this lead into a client account, then spin up a project and quote/invoice from
            the same record chain. Deals still live in the Sales Pipeline tab.
          </p>
          <CallDialerPanel lead={lead} queue={queue} onOpenLead={onOpenLead} />
        </div>
      </div>
    </SideDrawer>
  );
}
