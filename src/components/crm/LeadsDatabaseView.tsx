'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Upload,
  Filter,
  DollarSign,
  Users,
  Target,
  TrendingUp,
  Mail,
  Phone,
  ArrowUpRight,
  Trash2,
  Edit2,
  Check,
  X,
  ExternalLink,
  ChevronDown,
  Building,
  Sparkles,
} from 'lucide-react';
import {
  LeadCard,
  LeadFilter,
  LeadSource,
  LEAD_FILTERS,
} from '@/data/crmData';
import BulkImportLeadsModal from '@/components/crm/BulkImportLeadsModal';
import { useAgency } from '@/context/AgencyContext';
import LeadDetailModal from '@/components/crm/LeadDetailModal';

interface LeadsDatabaseViewProps {
  onConvertToDeal?: (lead: LeadCard) => void;
  onOpenCreateDoc?: (lead: LeadCard) => void;
}

export default function LeadsDatabaseView({
  onConvertToDeal,
  onOpenCreateDoc,
}: LeadsDatabaseViewProps) {
  const {
    leads,
    addLead,
    updateLead,
    deleteLead,
    importLeads,
    convertLeadToClient,
    createDocument,
    createProjectForClient,
    clients,
  } = useAgency();
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [detailLead, setDetailLead] = useState<LeadCard | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Modals
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);

  // Add lead form state
  const [formName, setFormName] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formPriority, setFormPriority] = useState<LeadFilter>('Hot Clients');
  const [formRating, setFormRating] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [formSource, setFormSource] = useState<LeadSource>('LinkedIn');
  const [formValue, setFormValue] = useState('45000');

  // Stats calculation
  const stats = useMemo(() => {
    const total = leads.length;
    const hotCount = leads.filter((l) => l.priority === 'Hot Clients').length;
    const qualifiedCount = leads.filter((l) => l.status === 'Qualified' || l.status === 'Proposal').length;
    const totalEstValue = leads.reduce((acc, l) => acc + (l.estimatedValue || 35000), 0);
    return { total, hotCount, qualifiedCount, totalEstValue };
  }, [leads]);

  // Filter leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (priorityFilter !== 'All' && lead.priority !== priorityFilter) return false;
      if (statusFilter !== 'All' && lead.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          lead.name.toLowerCase().includes(q) ||
          lead.title.toLowerCase().includes(q) ||
          (lead.company && lead.company.toLowerCase().includes(q)) ||
          (lead.email && lead.email.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [leads, priorityFilter, statusFilter, searchQuery]);

  // Handle lead creation
  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const initials = formName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const colors = ['bg-[#7c3aed]', 'bg-[#0284c7]', 'bg-[#d97706]', 'bg-[#059669]', 'bg-[#db2777]'];
    const avatarColor = colors[Math.floor(Math.random() * colors.length)];

    const newLead: LeadCard = {
      id: `lead-${Date.now()}`,
      name: formName,
      company: formCompany,
      title: formCompany ? `${formTitle || 'Executive'} at ${formCompany}` : formTitle || 'Executive',
      email: formEmail,
      phone: formPhone,
      avatarInitials: initials || 'LD',
      avatarColor,
      sources: [formSource],
      priority: formPriority,
      rating: formRating,
      status: 'New',
      estimatedValue: parseFloat(formValue) || 35000,
      createdDate: new Date().toISOString().split('T')[0],
    };

    addLead(newLead);
    setIsAddLeadOpen(false);
    setFormName('');
    setFormCompany('');
    setFormTitle('');
    setFormEmail('');
    setFormPhone('');
  };

  // Handle bulk import commit
  const handleBulkImport = (imported: LeadCard[]) => {
    importLeads(imported);
  };

  // Quick toggle status
  const handleToggleStatus = (id: string) => {
    const lead = leads.find((l) => l.id === id);
    if (!lead) return;
    const current = lead.status || 'New';
    const next: LeadCard['status'] =
      current === 'New'
        ? 'Contacted'
        : current === 'Contacted'
        ? 'Qualified'
        : current === 'Qualified'
        ? 'Proposal'
        : current === 'Proposal'
        ? 'Converted'
        : current === 'Converted'
        ? 'Lost'
        : 'New';
    updateLead({ ...lead, status: next });
  };

  const handleDeleteLead = (id: string) => {
    if (!confirm('Delete this lead?')) return;
    deleteLead(id);
  };

  return (
    <div className="space-y-6">
      {/* ── Top Header Banner ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#141414] border border-[#222222] p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">Leads Database</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#b8ff00]/15 text-[#b8ff00] border border-[#b8ff00]/30">
              {leads.length} Records
            </span>
          </div>
          <p className="text-xs text-[#9ca3af] mt-1">
            Central repository of all enterprise leads, contact records, priority scores, and pipeline values
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsBulkImportOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#1f1f1f] border border-[#2e2e2e] hover:border-[#b8ff00] text-xs font-bold text-white transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Upload className="w-3.5 h-3.5 text-[#b8ff00]" />
            <span>Bulk Import Leads</span>
          </button>

          <button
            onClick={() => setIsAddLeadOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#b8ff00] hover:bg-[#a3e600] text-black font-black text-xs transition-all shadow-md shadow-[#b8ff00]/20 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Single Lead</span>
          </button>
        </div>
      </div>

      {/* ── Database Summary Cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111111] border border-[#222222] rounded-2xl p-4">
          <span className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Total Database Leads</span>
          <p className="text-2xl font-black text-white font-mono mt-1">{stats.total}</p>
          <span className="text-[11px] text-[#9ca3af]">Contacts in directory</span>
        </div>

        <div className="bg-[#111111] border border-[#222222] rounded-2xl p-4">
          <span className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Hot Clients</span>
          <p className="text-2xl font-black text-[#b8ff00] font-mono mt-1">{stats.hotCount}</p>
          <span className="text-[11px] text-[#9ca3af]">Highest conversion probability</span>
        </div>

        <div className="bg-[#111111] border border-[#222222] rounded-2xl p-4">
          <span className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Qualified / Proposal</span>
          <p className="text-2xl font-black text-[#38bdf8] font-mono mt-1">{stats.qualifiedCount}</p>
          <span className="text-[11px] text-[#9ca3af]">Ready for deal conversion</span>
        </div>

        <div className="bg-[#111111] border border-[#222222] rounded-2xl p-4">
          <span className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Est. Pipeline Value</span>
          <p className="text-2xl font-black text-[#00e676] font-mono mt-1">${stats.totalEstValue.toLocaleString()}</p>
          <span className="text-[11px] text-[#9ca3af]">Cumulative projected revenue</span>
        </div>
      </div>

      {/* ── Search & Multi-Filters Toolbar ─────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111111] border border-[#222222] p-4 rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7280]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads by name, company, email, position..."
            className="w-full bg-[#181818] border border-[#2a2a2a] focus:border-[#b8ff00] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#6b7280] outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-[#181818] border border-[#2a2a2a] focus:border-[#b8ff00] rounded-xl px-3 py-2 text-white outline-none"
          >
            <option value="All">All Priorities</option>
            {LEAD_FILTERS.filter((f) => f !== 'All').map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#181818] border border-[#2a2a2a] focus:border-[#b8ff00] rounded-xl px-3 py-2 text-white outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal">Proposal</option>
            <option value="Converted">Converted</option>
          </select>
        </div>
      </div>

      {/* ── Leads Database Table ───────────────────────────────────────────── */}
      <div className="bg-[#111111] border border-[#222222] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#161616] text-[#9ca3af] border-b border-[#222222] font-semibold">
              <tr>
                <th className="p-3.5">Lead / Company</th>
                <th className="p-3.5">Position & Title</th>
                <th className="p-3.5">Contact Details</th>
                <th className="p-3.5">Sources</th>
                <th className="p-3.5">Priority & Rating</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Est. Value</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c1c1c] bg-[#111111]">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-[#6b7280]">
                    No leads found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#181818] transition-colors group">
                    {/* Lead / Company */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl ${lead.avatarColor} text-white font-black text-xs flex items-center justify-center shrink-0 shadow-md`}
                        >
                          {lead.avatarInitials}
                        </div>
                        <div>
                          <p className="font-bold text-white text-xs">{lead.name}</p>
                          {lead.company && (
                            <p className="text-[11px] text-[#9ca3af] flex items-center gap-1">
                              <Building className="w-3 h-3 text-[#6b7280]" />
                              <span>{lead.company}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Position */}
                    <td className="p-3.5 text-[#d1d5db] font-medium max-w-xs truncate">{lead.title}</td>

                    {/* Contact */}
                    <td className="p-3.5 space-y-0.5 font-mono text-[11px] text-[#9ca3af]">
                      {lead.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-[#6b7280]" />
                          <span>{lead.email}</span>
                        </div>
                      )}
                      {lead.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#6b7280]" />
                          <span>{lead.phone}</span>
                        </div>
                      )}
                    </td>

                    {/* Sources */}
                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1">
                        {lead.sources.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#1a1a1a] border border-[#2e2e2e] text-[#9ca3af]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Priority & Rating */}
                    <td className="p-3.5 space-y-1">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1a1a1a] text-white border border-[#2a2a2a] block w-fit">
                        {lead.priority}
                      </span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${
                              i < lead.rating ? 'bg-[#b8ff00]' : 'bg-[#2a2a2a]'
                            }`}
                          />
                        ))}
                      </div>
                    </td>

                    {/* Status Toggle */}
                    <td className="p-3.5">
                      <button
                        onClick={() => handleToggleStatus(lead.id)}
                        className="px-2.5 py-1 rounded-full text-[10px] font-bold capitalize bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] text-[#b8ff00] transition-colors"
                        title="Click to advance status"
                      >
                        {lead.status || 'New'} &bull;
                      </button>
                    </td>

                    {/* Est Value */}
                    <td className="p-3.5 text-right font-mono font-bold text-white">
                      ${(lead.estimatedValue || 35000).toLocaleString()}
                    </td>

                    {/* Action buttons */}
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => { setDetailLead(lead); setDetailOpen(true); }}
                          className="px-2.5 py-1 rounded-lg bg-[#b8ff00]/15 hover:bg-[#b8ff00]/25 border border-[#b8ff00]/30 text-[#b8ff00] text-[11px] font-bold flex items-center gap-1 transition-colors"
                          title="Open lead"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Open</span>
                        </button>
                        {onConvertToDeal && (
                          <button
                            onClick={() => onConvertToDeal(lead)}
                            className="px-2.5 py-1 rounded-lg bg-[#00e676]/15 hover:bg-[#00e676]/25 border border-[#00e676]/30 text-[#00e676] text-[11px] font-bold flex items-center gap-1 transition-colors"
                            title="Promote in pipeline"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Pipeline</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          className="p-1 rounded-lg text-[#6b7280] hover:text-[#ef4444] hover:bg-[#221717] transition-colors"
                          title="Delete lead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add Single Lead Modal ─────────────────────────────────────────── */}
      {isAddLeadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#141414] border border-[#2a2a2a] w-full max-w-lg rounded-2xl shadow-2xl p-6 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsAddLeadOpen(false)}
              className="absolute top-5 right-5 text-[#9ca3af] hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[#222]">
              <div className="w-10 h-10 rounded-xl bg-[#b8ff00]/20 border border-[#b8ff00]/40 flex items-center justify-center text-[#b8ff00]">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Add Lead to Database</h3>
                <p className="text-xs text-[#9ca3af]">Enter contact credentials, priority, and projected value</p>
              </div>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#d1d5db] font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rachel Adams"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-[#1c1c1c] border border-[#2e2e2e] focus:border-[#b8ff00] rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#d1d5db] font-semibold mb-1">Company / Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. Stripe, Inc."
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    className="w-full bg-[#1c1c1c] border border-[#2e2e2e] focus:border-[#b8ff00] rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#d1d5db] font-semibold mb-1">Job Title / Position</label>
                <input
                  type="text"
                  placeholder="e.g. Chief Technology Officer"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-[#2e2e2e] focus:border-[#b8ff00] rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#d1d5db] font-semibold mb-1">Work Email</label>
                  <input
                    type="email"
                    placeholder="rachel@company.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full bg-[#1c1c1c] border border-[#2e2e2e] focus:border-[#b8ff00] rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#d1d5db] font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 (415) 555-0199"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-[#1c1c1c] border border-[#2e2e2e] focus:border-[#b8ff00] rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#d1d5db] font-semibold mb-1">Priority Tier</label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as any)}
                    className="w-full bg-[#1c1c1c] border border-[#2e2e2e] focus:border-[#b8ff00] rounded-xl px-3 py-2 text-white outline-none"
                  >
                    <option value="Hot Clients">Hot Clients</option>
                    <option value="Great Interest">Great Interest</option>
                    <option value="Medium Interest">Medium Interest</option>
                    <option value="Low Interest">Low Interest</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#d1d5db] font-semibold mb-1">Estimated Value ($)</label>
                  <input
                    type="number"
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                    className="w-full bg-[#1c1c1c] border border-[#2e2e2e] focus:border-[#b8ff00] rounded-xl px-3 py-2 text-white font-mono outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#d1d5db] font-semibold mb-1">Lead Source</label>
                  <select
                    value={formSource}
                    onChange={(e) => setFormSource(e.target.value as any)}
                    className="w-full bg-[#1c1c1c] border border-[#2e2e2e] focus:border-[#b8ff00] rounded-xl px-3 py-2 text-white outline-none"
                  >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Email">Email</option>
                    <option value="Referral">Referral</option>
                    <option value="Cold Call">Cold Call</option>
                    <option value="Twitter">Twitter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#d1d5db] font-semibold mb-1">Rating (1-5)</label>
                  <select
                    value={formRating}
                    onChange={(e) => setFormRating(parseInt(e.target.value) as any)}
                    className="w-full bg-[#1c1c1c] border border-[#2e2e2e] focus:border-[#b8ff00] rounded-xl px-3 py-2 text-white outline-none"
                  >
                    <option value={5}>5 - Highest Fit</option>
                    <option value={4}>4 - High Fit</option>
                    <option value={3}>3 - Medium Fit</option>
                    <option value={2}>2 - Exploring</option>
                    <option value={1}>1 - Low Fit</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#222]">
                <button
                  type="button"
                  onClick={() => setIsAddLeadOpen(false)}
                  className="px-4 py-2 rounded-xl text-[#9ca3af] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#b8ff00] hover:bg-[#a3e600] text-black font-black shadow-md shadow-[#b8ff00]/20"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Bulk Import Modal ─────────────────────────────────────────────── */}
      <BulkImportLeadsModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        onImportLeads={handleBulkImport}
      />

      <LeadDetailModal
        lead={detailLead ? leads.find((l) => l.id === detailLead.id) || detailLead : null}
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        queue={filteredLeads}
        onOpenLead={(l) => setDetailLead(l)}
        onConvertToDeal={onConvertToDeal}
        onConvertToClient={(l) => convertLeadToClient(l.id, { createProject: true })}
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
          if (client) createProjectForClient(client.id, { title: `${client.company} — Engagement`, budget: l.estimatedValue || 500000 });
        }}
        onDelete={(l) => { handleDeleteLead(l.id); setDetailOpen(false); }}
      />

    </div>
  );
}
