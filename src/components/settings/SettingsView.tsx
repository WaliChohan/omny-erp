'use client';

import React, { useEffect, useState } from 'react';
import { Building2, Save, Check, Users } from 'lucide-react';

const STORAGE_KEY = 'omnysync_agency_settings';

type Role = 'Owner' | 'Admin' | 'PM' | 'Sales' | 'Finance' | 'Viewer';

interface TeamRole {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AgencySettings {
  agencyName: string;
  tagline: string;
  focus: string;
  currency: string;
  timezone: string;
  invoicePrefix: string;
  defaultPaymentTerms: string;
  team: TeamRole[];
}

const DEFAULTS: AgencySettings = {
  agencyName: 'OMNYSYNC',
  tagline: 'Websites · Custom software · SEO · Apps',
  focus: 'HVAC & home-services agencies',
  currency: 'PKR',
  timezone: 'Asia/Karachi',
  invoicePrefix: 'INV',
  defaultPaymentTerms: 'Net 15',
  team: [
    { id: 'u1', name: 'Sarah Connor', email: 'sarah.c@omnysync.io', role: 'Owner' },
    { id: 'u2', name: 'Alex Vance', email: 'alex.v@omnysync.io', role: 'PM' },
    { id: 'u3', name: 'Elena Rostova', email: 'elena.r@omnysync.io', role: 'Sales' },
    { id: 'u4', name: 'Devon Miles', email: 'devon.m@omnysync.io', role: 'Finance' },
  ],
};

export default function SettingsView() {
  const [form, setForm] = useState<AgencySettings>(DEFAULTS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setForm({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const updateRole = (id: string, role: Role) => {
    setForm((f) => ({
      ...f,
      team: f.team.map((t) => (t.id === id ? { ...t, role } : t)),
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Settings</h1>
        <p className="text-xs text-[#9ca3af] mt-0.5">
          Agency identity, billing defaults, and team roles (local until API is wired).
        </p>
      </div>

      <form onSubmit={save} className="rounded-2xl bg-[#121815] border border-[#1a2720] p-5 space-y-4">
        <div className="flex items-center gap-2 text-[#2dd4bf] mb-1">
          <Building2 className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Agency profile</span>
        </div>
        {(
          [
            ['agencyName', 'Agency name'],
            ['tagline', 'Tagline'],
            ['focus', 'Market focus'],
            ['currency', 'Currency'],
            ['timezone', 'Timezone'],
            ['invoicePrefix', 'Invoice prefix'],
            ['defaultPaymentTerms', 'Default payment terms'],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="block text-[11px] text-[#9ca3af] space-y-1">
            <span>{label}</span>
            <input
              value={form[key]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              className="w-full bg-[#0f1612] border border-[#223328] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#2dd4bf]"
            />
          </label>
        ))}

        <div className="pt-4 border-t border-[#1a2720] space-y-3">
          <div className="flex items-center gap-2 text-[#2dd4bf]">
            <Users className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Team roles</span>
          </div>
          <div className="space-y-2">
            {form.team.map((member) => (
              <div
                key={member.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#0f1612] border border-[#1e2d24] px-3 py-2"
              >
                <div>
                  <p className="text-xs font-bold text-white">{member.name}</p>
                  <p className="text-[11px] text-[#9ca3af]">{member.email}</p>
                </div>
                <select
                  value={member.role}
                  onChange={(e) => updateRole(member.id, e.target.value as Role)}
                  className="bg-[#141e18] border border-[#223328] rounded-lg px-2 py-1.5 text-[11px] text-white outline-none"
                >
                  {(['Owner', 'Admin', 'PM', 'Sales', 'Finance', 'Viewer'] as Role[]).map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-[#6b7280]">
            Roles are informational for now — wire to auth/permissions when backend lands.
          </p>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2dd4bf] text-[#052e24] text-xs font-bold hover:bg-[#5eead4] transition-colors"
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved' : 'Save settings'}
        </button>
      </form>
    </div>
  );
}
