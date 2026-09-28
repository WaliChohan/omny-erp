'use client';

import React, { useMemo, useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Building2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  X,
  Check,
  Filter,
  Users,
} from 'lucide-react';
import {
  AGENCY_CLIENTS,
  CLIENT_STATUS_FILTERS,
  AgencyClient,
  ClientStatus,
  ServiceLine,
  formatClientPKR,
} from '@/data/clientsData';

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
  const [clients, setClients] = useState<AgencyClient[]>(AGENCY_CLIENTS);
  const [statusFilter, setStatusFilter] = useState<(typeof CLIENT_STATUS_FILTERS)[number]>('All');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(AGENCY_CLIENTS[0]?.id ?? null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('omnysync_agency_clients');
      if (raw) {
        const parsed = JSON.parse(raw) as AgencyClient[];
        if (Array.isArray(parsed) && parsed.length) {
          setClients(parsed);
          setSelectedId(parsed[0].id);
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('omnysync_agency_clients', JSON.stringify(clients));
    } catch {
      /* ignore */
    }
  }, [clients]);

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

  const summary = useMemo(() => {
    const active = clients.filter((c) => c.status === 'Active').length;
    const mrr = clients.reduce((sum, c) => sum + (c.status === 'Active' || c.status === 'Onboarding' ? c.mrr : 0), 0);
    const projects = clients.reduce((sum, c) => sum + c.openProjects, 0);
    return { total: clients.length, active, mrr, projects };
  }, [clients]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

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
      openProjects: form.status === 'Onboarding' || form.status === 'Active' ? 1 : 0,
      accountManager: form.accountManager.trim() || 'Sarah Connor',
      city: form.city.trim() || '—',
      joinedAt: new Date().toISOString().slice(0, 10),
      lastTouch: new Date().toISOString().slice(0, 10),
      notes: form.notes.trim() || undefined,
    };
    setClients((prev) => [newClient, ...prev]);
    setSelectedId(newClient.id);
    setIsCreating(false);
    setForm(emptyForm);
    showToast(`Client ${newClient.company} added`);
  };

  const updateStatus = (id: string, status: ClientStatus) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status, lastTouch: new Date().toISOString().slice(0, 10), openProjects: status === 'Churned' ? 0 : c.openProjects }
          : c
      )
    );
    showToast(`Status → ${status}`);
  };

  const toggleService = (svc: ServiceLine) => {
    setForm((f) => ({
      ...f,
      services: f.services.includes(svc) ? f.services.filter((s) => s !== svc) : [...f.services, svc],
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Clients</h1>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            HVAC & home-services accounts — retainers, websites, software, and SEO.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2dd4bf] text-[#052e24] text-xs font-bold hover:bg-[#5eead4] transition-all shadow-md shadow-[#2dd4bf]/20"
        >
          <Plus className="w-4 h-4" />
          Add Client
        </button>
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
                <p className="text-[10px] uppercase tracking-wider text-[#6b7280] font-semibold">{card.label}</p>
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
                No clients match. Try another filter or add a new account.
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
                      <p className="text-[11px] text-[#9ca3af] truncate">{c.name} · {c.industry}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${statusBadge(c.status)}`}>
                      {c.status}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {c.services.slice(0, 3).map((s) => (
                      <span key={s} className="px-1.5 py-0.5 rounded bg-[#0f1612] border border-[#223328] text-[9px] text-[#9ca3af]">
                        {s}
                      </span>
                    ))}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="xl:col-span-7 rounded-2xl bg-[#121815] border border-[#1a2720] p-5">
          {!selected ? (
            <div className="h-full flex items-center justify-center text-sm text-[#6b7280]">
              Select a client to view details.
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#18261e] border border-[#274032] flex items-center justify-center text-[#2dd4bf]">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white">{selected.company}</h2>
                    <p className="text-xs text-[#9ca3af]">{selected.name} · AM {selected.accountManager}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusBadge(selected.status)}`}>
                  {selected.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 text-[#9ca3af]"><Mail className="w-3.5 h-3.5 text-[#2dd4bf]" />{selected.email}</div>
                <div className="flex items-center gap-2 text-[#9ca3af]"><Phone className="w-3.5 h-3.5 text-[#2dd4bf]" />{selected.phone}</div>
                <div className="flex items-center gap-2 text-[#9ca3af]"><MapPin className="w-3.5 h-3.5 text-[#2dd4bf]" />{selected.city}</div>
                <div className="flex items-center gap-2 text-[#9ca3af]"><Briefcase className="w-3.5 h-3.5 text-[#2dd4bf]" />{selected.industry}</div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-[#0f1612] border border-[#1e2d24] p-3">
                  <p className="text-[10px] text-[#6b7280] uppercase font-semibold">MRR</p>
                  <p className="text-sm font-black text-white mt-1">{formatClientPKR(selected.mrr)}</p>
                </div>
                <div className="rounded-xl bg-[#0f1612] border border-[#1e2d24] p-3">
                  <p className="text-[10px] text-[#6b7280] uppercase font-semibold">LTV</p>
                  <p className="text-sm font-black text-white mt-1">{formatClientPKR(selected.lifetimeValue)}</p>
                </div>
                <div className="rounded-xl bg-[#0f1612] border border-[#1e2d24] p-3">
                  <p className="text-[10px] text-[#6b7280] uppercase font-semibold">Projects</p>
                  <p className="text-sm font-black text-white mt-1">{selected.openProjects}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#6b7280] font-semibold mb-2">Services</p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.services.map((s) => (
                    <span key={s} className="px-2.5 py-1 rounded-lg bg-[#18261e] border border-[#274032] text-[11px] font-semibold text-[#2dd4bf]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {selected.notes && (
                <div className="rounded-xl bg-[#0f1612] border border-[#1e2d24] p-3 text-xs text-[#9ca3af]">
                  {selected.notes}
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-1">
                <p className="w-full text-[10px] uppercase tracking-wider text-[#6b7280] font-semibold">Update status</p>
                {(['Active', 'Onboarding', 'Paused', 'Churned'] as ClientStatus[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(selected.id, s)}
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

              <p className="text-[10px] text-[#4b5563]">
                Joined {selected.joinedAt} · Last touch {selected.lastTouch}
              </p>
            </div>
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
              <button type="button" onClick={() => setIsCreating(false)} className="text-[#6b7280] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                ['name', 'Contact name', 'text'],
                ['company', 'Company', 'text'],
                ['email', 'Email', 'email'],
                ['phone', 'Phone', 'text'],
                ['industry', 'Industry', 'text'],
                ['city', 'City', 'text'],
                ['accountManager', 'Account manager', 'text'],
                ['mrr', 'Monthly retainer (PKR)', 'number'],
              ].map(([key, label, type]) => (
                <label key={key} className="text-[11px] text-[#9ca3af] space-y-1">
                  <span>{label}</span>
                  <input
                    type={type}
                    required={key === 'name' || key === 'company' || key === 'email'}
                    value={(form as any)[key]}
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
            <label className="block text-[11px] text-[#9ca3af] space-y-1">
              <span>Status</span>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as ClientStatus }))}
                className="w-full bg-[#0f1612] border border-[#223328] rounded-lg px-3 py-2 text-xs text-white outline-none"
              >
                {(['Onboarding', 'Active', 'Paused', 'Churned'] as ClientStatus[]).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
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
            <label className="block text-[11px] text-[#9ca3af] space-y-1">
              <span>Notes</span>
              <textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                rows={2}
                className="w-full bg-[#0f1612] border border-[#223328] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#2dd4bf] resize-none"
              />
            </label>
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setIsCreating(false)} className="px-3 py-2 rounded-lg text-xs text-[#9ca3af] hover:text-white">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-[#2dd4bf] text-[#052e24] text-xs font-bold">
                Save client
              </button>
            </div>
          </form>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#18261e] border border-[#2dd4bf]/40 text-xs font-semibold text-[#2dd4bf] shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}
