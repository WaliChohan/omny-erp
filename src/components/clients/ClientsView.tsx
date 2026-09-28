'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Search, Plus, Building2, Mail, Phone, MapPin, Briefcase, X, Check, Filter, Users, FileText, Receipt, ExternalLink, Upload } from 'lucide-react';
import {
  CLIENT_STATUS_FILTERS,
  AgencyClient,
  ClientStatus,
  ServiceLine,
  formatClientPKR,
} from '@/data/clientsData';
import { useAgency } from '@/context/AgencyContext';
import BulkImportLeadsModal from '@/components/crm/BulkImportLeadsModal';
import { formatPKR } from '@/data/financialData';

const SERVICE_OPTIONS: ServiceLine[] = [
  'Website',
  'Custom Software',
  'SEO',
  'Mobile App',
  'Retainer',
];

const emptyForm = {
  name: '',
  company: '',
  industry: 'HVAC',
  email: '',
  phone: '',
  status: 'Onboarding' as ClientStatus,
  services: ['Website'] as ServiceLine[],
  mrr: 0,
  city: '',
  accountManager: 'Sarah Connor',
  notes: '',
};

export default function ClientsView() {
  const {
    clients,
    upsertClient,
    updateClientStatus,
    createProjectForClient,
    createDocument,
    getProjectsForClient,
    getDocsForClient,
    navigate,
    consumeFocus,
    importClients,
  } = useAgency();
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);

  const [statusFilter, setStatusFilter] = useState<(typeof CLIENT_STATUS_FILTERS)[number]>('All');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(clients[0]?.id ?? null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const id = consumeFocus('client');
    if (id) setSelectedId(id);
  }, [consumeFocus]);

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      if (statusFilter !== 'All' && c.status !== statusFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.services.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [clients, statusFilter, search]);

  const selected = clients.find((c) => c.id === selectedId) ?? filtered[0] ?? null;
  const relatedProjects = selected ? getProjectsForClient(selected.id) : [];
  const relatedDocs = selected ? getDocsForClient(selected.id) : [];

  const summary = useMemo(() => {
    const active = clients.filter((c) => c.status === 'Active').length;
    const mrr = clients.reduce(
      (sum, c) => sum + (c.status === 'Active' || c.status === 'Onboarding' ? c.mrr : 0),
      0
    );
    const projects = clients.reduce((sum, c) => sum + c.openProjects, 0);
    return { total: clients.length, active, mrr, projects };
  }, [clients]);

  const statusBadge = (status: ClientStatus) => {
    const map: Record<ClientStatus, string> = {
      Active: 'bg-[#142e22] text-[#10b981] border-[#1f4a35]',
      Onboarding: 'bg-[#1e2538] text-[#a5b4fc] border-[#3b4b73]',
      Paused: 'bg-[#3b2816] text-[#f59e0b] border-[#5a3a1b]',
      Churned: 'bg-[#421b24] text-[#f43f5e] border-[#6b2132]',
    };
    return map[status];
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.company.trim() || !form.email.trim()) return;
    const newClient: AgencyClient = {
      id: `cli-${Date.now()}`,
      name: form.name.trim(),
      company: form.company.trim(),
      industry: form.industry.trim() || 'Home Services',
      email: form.email.trim(),
      phone: form.phone.trim() || '—',
      status: form.status,
      services: form.services.length ? form.services : ['Website'],
      mrr: Number(form.mrr) || 0,
      lifetimeValue: Number(form.mrr) || 0,
      openProjects: form.status === 'Onboarding' || form.status === 'Active' ? 0 : 0,
      accountManager: form.accountManager.trim() || 'Sarah Connor',
      city: form.city.trim() || '—',
      joinedAt: new Date().toISOString().slice(0, 10),
      lastTouch: new Date().toISOString().slice(0, 10),
      notes: form.notes.trim() || undefined,
    };
    upsertClient(newClient);
    setSelectedId(newClient.id);
    setIsCreating(false);
    setForm(emptyForm);
  };

  const toggleService = (svc: ServiceLine) => {
    setForm((f) => ({
      ...f,
      services: f.services.includes(svc)
        ? f.services.filter((s) => s !== svc)
        : [...f.services, svc],
    }));
  };

  return (
    <>
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Clients</h1>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            Linked to CRM leads, projects, quotes, and invoices.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsBulkImportOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141d18] border border-[#1e2a22] text-[#e5e7eb] text-xs font-bold hover:border-[#2dd4bf]/40"
          >
            <Upload className="w-4 h-4 text-[#2dd4bf]" />
            Import clients
          </button>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2dd4bf] text-[#052e24] text-xs font-bold hover:bg-[#5eead4] transition-all shadow-md shadow-[#2dd4bf]/20"
          >
            <Plus className="w-4 h-4" />
            Add Client
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Accounts', value: String(summary.total), icon: Users },
          { label: 'Active', value: String(summary.active), icon: Check },
          { label: 'Retainer MRR', value: formatClientPKR(summary.mrr), icon: Briefcase },
          { label: 'Open Projects', value: String(summary.projects), icon: Building2 },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-2xl bg-[#121815] border border-[#1a2720] p-4 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-[#18261e] border border-[#23382c] flex items-center justify-center text-[#2dd4bf]">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#6b7280] font-semibold">
                  {card.label}
                </p>
                <p className="text-lg font-black text-white">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="w-3.5 h-3.5 text-[#6b7280] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients, industries, services..."
            className="w-full bg-[#141d18] border border-[#223328] focus:border-[#2dd4bf] text-white text-xs pl-9 pr-3 py-2 rounded-xl outline-none"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-[#6b7280] shrink-0" />
          {CLIENT_STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                statusFilter === s
                  ? 'bg-[#2dd4bf] text-[#052e24]'
                  : 'bg-[#141e18] text-[#9ca3af] hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 min-h-[480px]">
        <div className="xl:col-span-5 rounded-2xl bg-[#121815] border border-[#1a2720] overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-[#1a2720] flex items-center justify-between">
            <span className="text-xs font-bold text-white">{filtered.length} clients</span>
            <span className="text-[10px] text-[#6b7280]">Click to open</span>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-[#1a2720]">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#6b7280]">
                No clients match. Import a CSV/TSV roster or add a new account.
              </div>
            ) : (
              filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`w-full text-left px-4 py-3 transition-colors ${
                    selected?.id === c.id ? 'bg-[#18261e]' : 'hover:bg-[#141e18]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{c.company}</p>
                      <p className="text-[11px] text-[#9ca3af] truncate">
                        {c.name} · {c.industry}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${statusBadge(
                        c.status
                      )}`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {c.services.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="px-1.5 py-0.5 rounded bg-[#0f1612] border border-[#223328] text-[9px] text-[#9ca3af]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="xl:col-span-7 rounded-2xl bg-[#121815] border border-[#1a2720] p-5 space-y-5">
          {!selected ? (
            <div className="h-full flex items-center justify-center text-sm text-[#6b7280]">
              Select a client to view details.
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#18261e] border border-[#274032] flex items-center justify-center text-[#2dd4bf]">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white">{selected.company}</h2>
                    <p className="text-xs text-[#9ca3af]">
                      {selected.name} · AM {selected.accountManager}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusBadge(
                    selected.status
                  )}`}
                >
                  {selected.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 text-[#9ca3af]">
                  <Mail className="w-3.5 h-3.5 text-[#2dd4bf]" />
                  {selected.email}
                </div>
                <div className="flex items-center gap-2 text-[#9ca3af]">
                  <Phone className="w-3.5 h-3.5 text-[#2dd4bf]" />
                  {selected.phone}
                </div>
                <div className="flex items-center gap-2 text-[#9ca3af]">
                  <MapPin className="w-3.5 h-3.5 text-[#2dd4bf]" />
                  {selected.city}
                </div>
                <div className="flex items-center gap-2 text-[#9ca3af]">
                  <Briefcase className="w-3.5 h-3.5 text-[#2dd4bf]" />
                  {selected.industry}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-[#0f1612] border border-[#1e2d24] p-3">
                  <p className="text-[10px] text-[#6b7280] uppercase font-semibold">MRR</p>
                  <p className="text-sm font-black text-white mt-1">
                    {formatClientPKR(selected.mrr)}
                  </p>
                </div>
                <div className="rounded-xl bg-[#0f1612] border border-[#1e2d24] p-3">
                  <p className="text-[10px] text-[#6b7280] uppercase font-semibold">LTV</p>
                  <p className="text-sm font-black text-white mt-1">
                    {formatClientPKR(selected.lifetimeValue)}
                  </p>
                </div>
                <div className="rounded-xl bg-[#0f1612] border border-[#1e2d24] p-3">
                  <p className="text-[10px] text-[#6b7280] uppercase font-semibold">Projects</p>
                  <p className="text-sm font-black text-white mt-1">{relatedProjects.length}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => createProjectForClient(selected.id)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#2dd4bf] text-[#052e24] text-[11px] font-bold"
                >
                  <Briefcase className="w-3.5 h-3.5" /> New project
                </button>
                <button
                  onClick={() =>
                    createDocument({
                      docType: 'quotation',
                      clientId: selected.id,
                      title: `Quote — ${selected.company}`,
                      amount: Math.max(selected.mrr * 3, 350000),
                    })
                  }
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#141e18] border border-[#223328] text-[11px] font-bold text-white"
                >
                  <FileText className="w-3.5 h-3.5 text-[#38bdf8]" /> Quote
                </button>
                <button
                  onClick={() =>
                    createDocument({
                      docType: 'invoice',
                      clientId: selected.id,
                      title: `Invoice — ${selected.company}`,
                      amount: Math.max(selected.mrr, 250000),
                    })
                  }
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#141e18] border border-[#223328] text-[11px] font-bold text-white"
                >
                  <Receipt className="w-3.5 h-3.5 text-[#10b981]" /> Invoice
                </button>
                {selected.leadId && (
                  <button
                    onClick={() =>
                      navigate({ tab: 'crm', focus: { kind: 'lead', id: selected.leadId! } })
                    }
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#141e18] border border-[#223328] text-[11px] font-bold text-[#9ca3af]"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Source lead
                  </button>
                )}
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#6b7280] font-semibold mb-2">
                  Related projects
                </p>
                {relatedProjects.length === 0 ? (
                  <p className="text-xs text-[#6b7280]">No projects yet.</p>
                ) : (
                  <div className="space-y-1.5">
                    {relatedProjects.map((p) => (
                      <button
                        key={p.id}
                        onClick={() =>
                          navigate({ tab: 'projects', focus: { kind: 'project', id: p.id } })
                        }
                        className="w-full flex items-center justify-between rounded-xl bg-[#0f1612] border border-[#1e2d24] px-3 py-2 text-left hover:border-[#2dd4bf]/40"
                      >
                        <span className="text-xs font-semibold text-white truncate">{p.title}</span>
                        <span className="text-[10px] text-[#9ca3af]">{p.progressPercent}%</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#6b7280] font-semibold mb-2">
                  Billing docs
                </p>
                {relatedDocs.length === 0 ? (
                  <p className="text-xs text-[#6b7280]">No quotes or invoices yet.</p>
                ) : (
                  <div className="space-y-1.5">
                    {relatedDocs.slice(0, 6).map((d) => (
                      <button
                        key={d.id}
                        onClick={() =>
                          navigate({
                            tab: 'finance',
                            financeSub: d.docType === 'invoice' ? 'invoices' : 'quotes',
                            focus: { kind: 'document', id: d.id },
                          })
                        }
                        className="w-full flex items-center justify-between rounded-xl bg-[#0f1612] border border-[#1e2d24] px-3 py-2 text-left hover:border-[#2dd4bf]/40"
                      >
                        <span className="text-xs font-semibold text-white truncate">
                          {d.docNumber} · {d.docType}
                        </span>
                        <span className="text-[10px] text-[#9ca3af]">
                          {formatPKR(d.totalAmount, true)} · {d.status}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <p className="w-full text-[10px] uppercase tracking-wider text-[#6b7280] font-semibold">
                  Update status
                </p>
                {(['Active', 'Onboarding', 'Paused', 'Churned'] as ClientStatus[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateClientStatus(selected.id, s)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                      selected.status === s
                        ? 'bg-[#2dd4bf] text-[#052e24] border-[#2dd4bf]'
                        : 'bg-[#141e18] text-[#9ca3af] border-[#223328] hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {isCreating && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreate}
            className="w-full max-w-lg rounded-2xl bg-[#121815] border border-[#1e2d24] p-5 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white">Add agency client</h3>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="text-[#6b7280] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(
                [
                  ['name', 'Contact name', 'text'],
                  ['company', 'Company', 'text'],
                  ['email', 'Email', 'email'],
                  ['phone', 'Phone', 'text'],
                  ['industry', 'Industry', 'text'],
                  ['city', 'City', 'text'],
                  ['accountManager', 'Account manager', 'text'],
                  ['mrr', 'Monthly retainer (PKR)', 'number'],
                ] as const
              ).map(([key, label, type]) => (
                <label key={key} className="text-[11px] text-[#9ca3af] space-y-1">
                  <span>{label}</span>
                  <input
                    type={type}
                    required={key === 'name' || key === 'company' || key === 'email'}
                    value={(form as Record<string, string | number | ServiceLine[] | ClientStatus>)[key] as string | number}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        [key]: type === 'number' ? Number(e.target.value) : e.target.value,
                      }))
                    }
                    className="w-full bg-[#0f1612] border border-[#223328] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#2dd4bf]"
                  />
                </label>
              ))}
            </div>
            <div>
              <p className="text-[11px] text-[#9ca3af] mb-1.5">Services</p>
              <div className="flex flex-wrap gap-1.5">
                {SERVICE_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleService(s)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                      form.services.includes(s)
                        ? 'bg-[#2dd4bf]/15 text-[#2dd4bf] border-[#2dd4bf]/40'
                        : 'bg-[#0f1612] text-[#6b7280] border-[#223328]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3 py-2 rounded-lg text-xs text-[#9ca3af] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#2dd4bf] text-[#052e24] text-xs font-bold"
              >
                Save client
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
      <BulkImportLeadsModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        entity="clients"
        onImportClients={(rows) => importClients(rows)}
      />
    </>
  );
}
